export const GEMINI_API_KEY = 'your-gemini-api-key-here';
export const AZURE_CLIENT_ID = 'your-azure-client-id-here';

// Optional: Customize AI prompts
export const CUSTOM_PROMPTS = {
  mom: "Generate comprehensive Minutes of Meeting from this transcript with key decisions, discussions, and participants:",
  actionItems: "Extract all action items with assigned owners and deadlines from this meeting transcript:",
  summary: "Create a concise 3-bullet executive summary of this meeting:",
  notes: "Extract the most important notes and key takeaways from this meeting:",
  insights: "Analyze this meeting for key insights, trends, and recommendations:",
  followUp: "Identify follow-up actions and next steps from this meeting:"
};

// Optional: Teams app customization
export const APP_CONFIG = {
  name: "Teams Meeting Insights Pro",
  description: "AI-powered meeting analysis and documentation",
  accentColor: "#6264A7",
  version: "2.0.0"
};
