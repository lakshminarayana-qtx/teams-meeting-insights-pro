import React, { useState, useEffect } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';

// Safe configuration - no real keys exposed
const DEMO_MODE = !window.location.hostname.includes('your-secure-domain.com');

export default function App() {
  const [context, setContext] = useState(null);
  const [demoMode, setDemoMode] = useState(DEMO_MODE);

  useEffect(() => {
    microsoftTeams.app.initialize().then(() => {
      microsoftTeams.app.getContext().then(setContext);
    });
  }, []);

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
        {demoMode ? (
          <div className="demo-mode">
            <div className="demo-content">
              <h3>🔒 Demo Mode</h3>
              <p>This app is running in demo mode for security purposes.</p>
              <p>In a production environment with proper API keys, you would be able to:</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <span className="icon">🔐</span>
                  <strong>Authenticate with Microsoft Graph</strong>
                  <p>Sign in securely to access your Teams meetings</p>
                </div>
                
                <div className="feature-item">
                  <span className="icon">📅</span>
                  <strong>Access Recent Meetings</strong>
                  <p>View and select from your recent Teams meetings</p>
                </div>
                
                <div className="feature-item">
                  <span className="icon">🤖</span>
                  <strong>AI-Powered Analysis</strong>
                  <p>Generate insights using Google Gemini AI</p>
                </div>
                
                <div className="feature-item">
                  <span className="icon">📋</span>
                  <strong>Multiple Analysis Types</strong>
                  <p>Minutes, Action Items, Summary, Notes, and Insights</p>
                </div>
              </div>
              
              <div className="security-note">
                <h4>🛡️ Security Notice</h4>
                <p>This app is designed to run securely in your internal environment with proper API key management.</p>
                <p>No sensitive credentials are stored in this public repository.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="production-mode">
            {/* Your full app functionality would go here */}
            <p>Production mode with secure API integration</p>
          </div>
        )}
      </div>
    </div>
  );
}
