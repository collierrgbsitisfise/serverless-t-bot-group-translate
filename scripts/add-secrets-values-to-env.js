require('dotenv').config();

const fs = require('fs');

const ENV = process.env.ENV.toUpperCase();

console.log('ENV : ', ENV);
console.log('process.env : ', process.env);

const telegramToken = process.env[`${ENV}_BOT_TOKEN`];
const googleApiKey = process.env[`${ENV}_GOOGLE_TOKEN`];
const stripeSecret = process.env[`${ENV}_STRIPE_SECRET`];
const stripeWhsec = process.env[`${ENV}_STRIPE_WHSEC`];

console.log('main value !');
console.log('process.env[`${ENV}_BOT_TOKEN`] : ', process.env[`${ENV}_BOT_TOKEN`]);
console.log('process.env[`${ENV}_GOOGLE_TOKEN`] : ', process.env[`${ENV}_GOOGLE_TOKEN`]);
console.log('process.env[`${ENV}_STRIPE_SECRET`] : ', process.env[`${ENV}_STRIPE_SECRET`]);
console.log('process.env[`${ENV}_STRIPE_WHSEC`] : ', process.env[`${ENV}_STRIPE_WHSEC`]);

fs.appendFileSync('./.env', `\nBOT_TOKEN=${telegramToken}`);
fs.appendFileSync('./.env', `\nGOOGLE_TOKEN=${googleApiKey}`);
fs.appendFileSync('./.env', `\nSTRIPE_SECRET=${stripeSecret}`);
fs.appendFileSync('./.env', `\nSTRIPE_WHSEC=${stripeWhsec}`);
