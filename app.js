#!/usr/bin/env node

const type = process.argv[2];
const {Socket, createServer} = require('net');
const {spawn} = require('child_process');
const {userInfo} = require('os');
const path = require('path');
const PORT = process.env.WSL_PORT || 12476;
const HOST = process.env.WSL_HOST || '127.0.0.1';

if (process.platform === 'win32') {
  const WIN_BASE_DIR = `C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Packages\\CanonicalGroupLimited.Ubuntu18.04onWindows_79rhkp1fndgsc\\LocalState\\rootfs`;

  const server = createServer(socket => {
    socket.on('data', data => {
      data = JSON.parse(data);
      const cwd = translatePath(data.path);
      const cmd = spawn(
        process.env.comspec,
        ['/c', data.cmd, ...data.args],
        {cwd}
      );
      cmd.stdout.pipe(socket);
      cmd.stderr.pipe(socket);
      cmd.on('exit', code => socket.destroy(code));
      cmd.on('error', err => console.error(err));
    });
    socket.on('error', err => console.error(err));
  });
  server.listen(PORT, HOST);
  console.log(`Server listening on ${HOST}:${PORT}`);

  function translatePath(upath) {
    let winpath = '';
    winpath += upath;
    if (winpath.includes('/mnt/')) {
      winpath = data.path.replace('/mnt/', '');  
      winpath = winpath.replace(cwd[0],
        winpath[0].toUpperCase() + ':/');
    } else {
      winpath = WIN_BASE_DIR + winpath;
    }
    // if (cwd.includes('~')) cwd = cwd
    //   .replace('~', WIN_HOME_DIR + '\\home\\' + data.username);
    winpath = path.normalize(winpath);
    console.log(winpath);
    return winpath;
  }
} else {
  const client = new Socket();
  client.connect(PORT, HOST, () => {
    client.write(JSON.stringify({
      cmd: process.argv[2],
      args: process.argv.slice(3, process.argv.length),
      path: process.env.PWD,
      username: userInfo().username
    }));
  });
  client.on('data', data => console.log(data.toString()));
}
