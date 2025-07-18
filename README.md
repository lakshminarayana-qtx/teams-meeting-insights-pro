# 🎯 Teams Meeting Insights Pro

A professional Microsoft Teams app that automatically fetches meeting transcripts and generates comprehensive AI-powered insights using Google Gemini API.

## ✨ Features

- **🤖 AI-Powered Analysis**: Multiple analysis types (Minutes, Action Items, Summary, Notes, Insights, Follow-up)
- **🔄 Automatic Integration**: Seamlessly integrates with Microsoft Graph API
- **🎨 Teams Native Design**: Matches Teams design language with dark/light mode support
- **🔐 Secure Authentication**: Uses Microsoft MSAL for secure Graph API access
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **⚡ Fast Performance**: Optimized build with code splitting and lazy loading

## 🛠️ Quick Setup Guide

### Prerequisites
- Node.js 18+ 
- GitHub account for hosting
- Microsoft Azure account for app registration
- Google AI Studio account for Gemini API

### 1. Repository Setup
# teams-meeting-insights-pro

git clone https://github.com/YOUR-USERNAME/teams-meeting-insights-pro.git
cd teams-meeting-insights-pro
npm install


### 2. Configuration
Run the interactive setup wizard:
npm run setup


Or manually configure:
1. Copy `config.example.js` to `config.js`
2. Add your API keys and settings

### 3. Azure App Registration
1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Create new registration:
   - **Name**: Teams Meeting Insights Pro
   - **Redirect URI**: `https://YOUR-USERNAME.github.io/teams-meeting-insights-pro/`
3. Configure API permissions:
   - Microsoft Graph: `OnlineMeetings.Read`
   - Microsoft Graph: `Calendars.Read`
   - Microsoft Graph: `User.Read`

### 4. Google Gemini API Setup
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create new project or select existing
3. Generate API key
4. Add to your `config.js`

### 5. Deploy to GitHub Pages
npm run deploy


### 6. Create Teams App Package
npm run package



### 7. Install in Teams
1. Open Teams → Apps → Manage your apps
2. Upload `teams-meeting-insights-pro.zip`
3. Add to your personal apps

## 🚀 Development
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint
npm run lint:fix # Fix ESLint issues


## 📦 Project Structure
teams-meeting-insights-pro/
├── .github/workflows/ # GitHub Actions
├── public/manifest/ # Teams app manifest
├── src/ # React source code
├── scripts/ # Build and setup scripts
├── config.example.js # Configuration template
├── package.json # Dependencies and scripts
└── README.md # This file


## 🔧 Configuration Options

### Custom Prompts
Modify prompts in `config.js`:
export const CUSTOM_PROMPTS = {
mom: "Your custom MoM prompt...",
actionItems: "Your custom action items prompt...",
// ... more prompts
};
