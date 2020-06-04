

const type = process.argv[2];
const {Socket, createServer} = require('net');
const {spawn} = require('child_process');
const path = require('path');
const PORT = 1337;
const HOST = '127.0.0.1';

if (type === 'server') {
  const server = createServer(socket => {
    socket.on('data', data => {
      data = JSON.parse(data);
      let cmdPath = data.path.replace('/mnt/', '');      
      cmdPath = cmdPath.replace(cmdPath[0],
        cmdPath[0].toUpperCase() + ':/');
      cmdPath = path.normalize(cmdPath);
      console.log(['/c', data.cmd, cmdPath, ...data.args]);
      const cmd = spawn(process.env.comspec, 
        ['/c', data.cmd, cmdPath, ...data.args]);
      cmd.stdout.pipe(socket);
      cmd.stderr.pipe(socket);
      cmd.on('exit', code => socket.destroy(code));
      cmd.on('error', err => console.error(err));
    });
    socket.on('error', err => console.error(err));
  });
  server.listen(PORT, HOST);
  console.log(`Server listening on ${HOST}:${PORT}`);
}

if (type === 'client') {
  const client = new Socket();
  client.connect(PORT, HOST, () => {
    client.write(JSON.stringify({
      cmd: process.argv.slice(3, process.argv.length)
        .filter(arg => !arg.includes('-')).join(' '),
      path: process.env.PWD,
      args: process.argv.slice(4, process.argv.length)
        .filter(arg => arg.includes('-'))
    }));
  });
  client.on('data', data => console.log(data.toString()));
}
