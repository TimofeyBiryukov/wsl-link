

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
      let cwd = data.path.replace('/mnt/', '');      
      cwd = cwd.replace(cwd[0],
        cwd[0].toUpperCase() + ':/');
      cwd = path.normalize(cwd);
      const cmd = spawn(
        process.env.comspec,
        ['/c', `npm.cmd`, ...data.args],
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
} else {
  const client = new Socket();
  client.connect(PORT, HOST, () => {
    client.write(JSON.stringify({
      args: process.argv.slice(2, process.argv.length),
      path: process.env.PWD
    }));
  });
  client.on('data', data => console.log(data.toString()));
}