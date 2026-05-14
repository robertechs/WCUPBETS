#!/usr/bin/env node
// Admin CLI for managing market resolutions

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SOCIAL_OUTCOMES_FILE = path.join(__dirname, 'social_outcomes.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function loadSocialOutcomes() {
  if (fs.existsSync(SOCIAL_OUTCOMES_FILE)) {
    return JSON.parse(fs.readFileSync(SOCIAL_OUTCOMES_FILE, 'utf8'));
  }
  return {};
}

function saveSocialOutcomes(outcomes) {
  fs.writeFileSync(SOCIAL_OUTCOMES_FILE, JSON.stringify(outcomes, null, 2));
  console.log('✅ Saved outcomes to', SOCIAL_OUTCOMES_FILE);
}

async function setSocialOutcome() {
  console.log('\n📝 Set Social Market Outcome');
  console.log('─'.repeat(50));
  
  const marketId = await question('Market ID (e.g., CZ_TWEET): ');
  const outcomeStr = await question('Outcome (1=YES, 2=NO): ');
  
  const outcome = parseInt(outcomeStr);
  if (outcome !== 1 && outcome !== 2) {
    console.log('❌ Invalid outcome. Must be 1 or 2.');
    return;
  }
  
  const outcomes = loadSocialOutcomes();
  outcomes[marketId] = outcome;
  saveSocialOutcomes(outcomes);
  
  console.log(`✅ Set ${marketId} outcome to ${outcome === 1 ? 'YES' : 'NO'}`);
}

async function viewOutcomes() {
  console.log('\n📊 Current Social Market Outcomes');
  console.log('─'.repeat(50));
  
  const outcomes = loadSocialOutcomes();
  if (Object.keys(outcomes).length === 0) {
    console.log('No outcomes set');
    return;
  }
  
  for (const [market, outcome] of Object.entries(outcomes)) {
    console.log(`${market}: ${outcome === 1 ? 'YES ✅' : 'NO ❌'}`);
  }
}

async function viewLogs() {
  const logFile = path.join(__dirname, 'resolver.log');
  if (!fs.existsSync(logFile)) {
    console.log('No log file found');
    return;
  }
  
  const logs = fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean);
  const recentLogs = logs.slice(-20); // Last 20 entries
  
  console.log('\n📜 Recent Logs (last 20 entries)');
  console.log('─'.repeat(50));
  
  recentLogs.forEach(line => {
    try {
      const log = JSON.parse(line);
      console.log(`[${log.timestamp}] ${log.level}: ${log.message}`);
      if (log.details) {
        console.log('  ', JSON.stringify(log.details, null, 2));
      }
    } catch (e) {
      console.log(line);
    }
  });
}

async function mainMenu() {
  console.log('\n🤖 Hivebets Resolver Admin CLI');
  console.log('═'.repeat(50));
  console.log('1. Set social market outcome');
  console.log('2. View current outcomes');
  console.log('3. View recent logs');
  console.log('4. Exit');
  console.log('═'.repeat(50));
  
  const choice = await question('Select option: ');
  
  switch (choice) {
    case '1':
      await setSocialOutcome();
      break;
    case '2':
      await viewOutcomes();
      break;
    case '3':
      await viewLogs();
      break;
    case '4':
      console.log('👋 Goodbye!');
      rl.close();
      return;
    default:
      console.log('❌ Invalid choice');
  }
  
  await mainMenu();
}

// Run CLI
mainMenu().catch(console.error);

