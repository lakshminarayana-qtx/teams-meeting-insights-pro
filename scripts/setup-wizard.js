const inquirer = require('inquirer');
const fs = require('fs');

async function setupWizard() {
  console.log('Welcome to Teams Meeting Insights Pro Setup!\n');
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'geminiApiKey',
      message: 'Enter your Google Gemini API key:',
      validate: (input) => input.length > 0 ? true : 'API key is required'
    },
    {
      type: 'input',
      name: 'azureClientId',
      message: 'Enter your Azure App Registration Client ID:',
      validate: (input) => input.length > 0 ? true : 'Client ID is required'
    },
    {
      type: 'input',
      name: 'githubUsername',
      message: 'Enter your GitHub username:',
      validate: (input) => input.length > 0 ? true : 'Username is required'
    },
    {
      type: 'input',
      name: 'companyName',
      message: 'Enter your company name:',
      default: 'Your Company'
    },
    {
      type: 'input',
      name: 'appName',
      message: 'Enter your app name:',
      default: 'Teams Meeting Insights Pro'
    }
  ]);
  
  const configContent = `// Auto-generated configuration for Teams Meeting Insights Pro
export const GEMINI_API_KEY = '${answers.geminiApiKey}';
export const AZURE_CLIENT_ID = '${answers.azureClientId}';

export const CUSTOM_PROMPTS = {
  mom: "Generate comprehensive Minutes of Meeting from this transcript with key decisions, discussions, and participants:",
  actionItems: "Extract all action items with assigned owners and deadlines from this meeting transcript:",
  summary: "Create a concise 3-bullet executive summary of this meeting:",
  notes: "Extract the most important notes and key takeaways from this meeting:",
  insights: "Analyze this meeting for key insights, trends, and recommendations:",
  followUp: "Identify follow-up actions and next steps from this meeting:"
};

export const APP_CONFIG = {
  name: "${answers.appName}",
  description: "AI-powered meeting analysis and documentation",
  accentColor: "#6264A7",
  version: "2.0.0",
  company: "${answers.companyName}"
};
`;
  
  fs.writeFileSync('config.js', configContent);
  
  // Update manifest.json
  const manifestPath = 'public/manifest/manifest.json';
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const baseUrl = `https://${answers.githubUsername}.github.io/teams-meeting-insights-pro/`;
    
    manifest.name.short = answers.appName;
    manifest.name.full = `${answers.appName} - AI-Powered Analysis`;
    manifest.developer.name = answers.companyName;
    manifest.staticTabs[0].contentUrl = baseUrl;
    manifest.staticTabs[0].websiteUrl = baseUrl;
    manifest.validDomains = [`${answers.githubUsername}.github.io`, "login.microsoftonline.com"];
    manifest.webApplicationInfo.id = answers.azureClientId;
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }
  
  console.log('\nSetup complete!');
  console.log('Next steps:');
  console.log('1. Run: npm run deploy');
  console.log('2. Run: npm run package');
  console.log('3. Upload teams-meeting-insights-pro.zip to Teams');
}

setupWizard().catch(console.error);
