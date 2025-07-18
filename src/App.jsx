import React, { useState, useEffect } from 'react';
import { Client } from '@microsoft/microsoft-graph-client';
import { PublicClientApplication } from '@azure/msal-browser';
import * as microsoftTeams from '@microsoft/teams-js';
import { GEMINI_API_KEY, AZURE_CLIENT_ID } from '../config.js';

const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

const prompts = {
  mom: "Generate comprehensive Minutes of Meeting from this transcript with key decisions, discussions, and participants:",
  actionItems: "Extract all action items with assigned owners and deadlines from this meeting transcript:",
  summary: "Create a concise 3-bullet executive summary of this meeting:",
  notes: "Extract the most important notes and key takeaways from this meeting:",
  insights: "Analyze this meeting for key insights, trends, and recommendations:",
  followUp: "Identify follow-up actions and next steps from this meeting:"
};

export default function App() {
  const [context, setContext] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('mom');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [graphClient, setGraphClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    microsoftTeams.app.initialize().then(() => {
      microsoftTeams.app.getContext().then(setContext);
    });
    initializeGraph();
  }, []);

  const initializeGraph = async () => {
    try {
      await msalInstance.initialize();
      const accounts = msalInstance.getAllAccounts();
      
      if (accounts.length > 0) {
        const silentRequest = {
          scopes: ['https://graph.microsoft.com/OnlineMeetings.Read', 'https://graph.microsoft.com/Calendars.Read'],
          account: accounts[0]
        };
        
        const response = await msalInstance.acquireTokenSilent(silentRequest);
        const client = Client.init({
          authProvider: (done) => done(null, response.accessToken)
        });
        
        setGraphClient(client);
        setIsAuthenticated(true);
        await fetchMeetings(client);
      }
    } catch (error) {
      console.error('Graph initialization failed:', error);
    }
  };

  const loginToGraph = async () => {
    try {
      const loginRequest = {
        scopes: ['https://graph.microsoft.com/OnlineMeetings.Read', 'https://graph.microsoft.com/Calendars.Read']
      };
      
      const response = await msalInstance.loginPopup(loginRequest);
      const client = Client.init({
        authProvider: (done) => done(null, response.accessToken)
      });
      
      setGraphClient(client);
      setIsAuthenticated(true);
      await fetchMeetings(client);
    } catch (error) {
      setError('Failed to authenticate with Microsoft Graph');
    }
  };

  const fetchMeetings = async (client) => {
    try {
      setLoading(true);
      setError('');
      const response = await client.api('/me/events')
        .filter("isOnlineMeeting eq true")
        .orderby("start/dateTime desc")
        .top(25)
        .get();
      setMeetings(response.value || []);
    } catch (error) {
      setError('Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscript = async (meetingId) => {
    try {
      // For demo purposes, we'll use a mock transcript
      // In production, this would fetch from Graph API
      const mockTranscript = `
        Meeting started at 10:00 AM
        Attendees: John Smith, Sarah Johnson, Mike Chen
        
        Discussion Points:
        1. Project timeline review
        2. Budget allocation for Q3
        3. Resource planning
        
        Decisions Made:
        - Approved budget increase of 15%
        - Extended project deadline by 2 weeks
        - Assigned Sarah as project lead
        
        Action Items:
        - John to prepare cost breakdown by Friday
        - Sarah to update project timeline
        - Mike to coordinate with IT department
        
        Next meeting scheduled for next Tuesday at 2:00 PM
      `;
      
      return mockTranscript;
    } catch (error) {
      setError('Failed to fetch transcript. This is a demo version.');
      return null;
    }
  };

  const generateInsights = async () => {
    if (!selectedMeeting) {
      setError('Please select a meeting first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const transcript = await fetchTranscript(selectedMeeting);
      if (!transcript) return;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${prompts[selectedPrompt]}\n\n${transcript}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || 'No insights generated');
    } catch (error) {
      setError('Failed to generate insights. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="teams-app">
      <div className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="icon">🎯</span>
            Teams Meeting Insights Pro
          </h1>
          <p className="app-subtitle">AI-powered meeting analysis and documentation</p>
        </div>
      </div>

      <div className="app-container">
        {!isAuthenticated ? (
          <div className="auth-prompt">
            <div className="auth-content">
              <h3>Welcome to Meeting Insights Pro</h3>
              <p>Sign in with your Microsoft account to access your Teams meetings and generate AI-powered insights</p>
              <button className="auth-button" onClick={loginToGraph}>
                <span className="icon">🔐</span>
                Sign in with Microsoft
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="control-panel">
              <div className="form-group">
                <label className="form-label">Select Meeting</label>
                <select 
                  className="form-select" 
                  value={selectedMeeting} 
                  onChange={(e) => setSelectedMeeting(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Choose a recent meeting...</option>
                  {meetings.map(meeting => (
                    <option key={meeting.id} value={meeting.id}>
                      {meeting.subject} - {new Date(meeting.start.dateTime).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Analysis Type</label>
                <div className="button-group">
                  {Object.entries(prompts).map(([key, description]) => (
                    <button
                      key={key}
                      className={`option-button ${selectedPrompt === key ? 'active' : ''}`}
                      onClick={() => setSelectedPrompt(key)}
                      disabled={loading}
                    >
                      {key === 'mom' ? 'Minutes' : 
                       key === 'actionItems' ? 'Action Items' : 
                       key === 'summary' ? 'Summary' : 
                       key === 'notes' ? 'Notes' : 
                       key === 'insights' ? 'Insights' :
                       key === 'followUp' ? 'Follow-up' : key}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className="generate-button" 
                onClick={generateInsights}
                disabled={loading || !selectedMeeting}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing Meeting...
                  </>
                ) : (
                  <>
                    <span className="icon">✨</span>
                    Generate Insights
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {result && (
              <div className="result-panel">
                <div className="result-header">
                  <h3>Generated Analysis</h3>
                  <button 
                    className="copy-button"
                    onClick={copyToClipboard}
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
                <div className="result-content">
                  <pre>{result}</pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
