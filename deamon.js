#!/usr/bin/env node

const pm2 = require('pm2');


pm2.connect(err => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  console.log('PM2 Connected');
  pm2.start({
    script: 'app.js'
  }, err => {
    console.log('PM2 Script Started');
    pm2.disconnect();
    if (err) throw err;
  });
})
