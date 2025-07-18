const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

async function packageApp() {
  console.log('Creating Teams Meeting Insights Pro package...');
  
  const manifestDir = path.join(__dirname, '../public/manifest');
  
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }
  
  const colorIcon = path.join(manifestDir, 'color.png');
  const outlineIcon = path.join(manifestDir, 'outline.png');
  
  if (!fs.existsSync(colorIcon)) {
    console.log('Warning: color.png not found. Please add a 192x192 color icon.');
  }
  
  if (!fs.existsSync(outlineIcon)) {
    console.log('Warning: outline.png not found. Please add a 32x32 outline icon.');
  }
  
  const output = fs.createWriteStream('teams-meeting-insights-pro.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  output.on('close', () => {
    console.log('Teams app package created: teams-meeting-insights-pro.zip');
    console.log(`Package size: ${archive.pointer()} bytes`);
    console.log('Ready to upload to Teams!');
  });
  
  archive.on('error', (err) => {
    throw err;
  });
  
  archive.pipe(output);
  archive.directory(manifestDir, false);
  
  await archive.finalize();
}

packageApp().catch(console.error);
