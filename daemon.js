#!/usr/bin/env node

const pm2 = require('pm2');
const package = require('./package.json');


pm2.connect(err => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  console.log('PM2 Connected');
  pm2.start({
    name: package.name,
    script: 'app.js'
  }, err => {
    console.log('PM2 Script Started');
    pm2.disconnect();
    if (err) throw err;
  });
})
