# WSL Link

Allows WSL users to run any CMD commands on host Windows system from within linux subsystem.

# WHY

[StackOverflow Question](https://stackoverflow.com/questions/62085598/linking-windows-commands-inside-windows-subsystem-for-linux-ubuntu)


TODO

# Requirements

* Windows 10
* WSL
* Node.js
* NPM

> Node and NPM have to be installed both in linux subsystem and on Windows host system.

# Install

> wsl-link has to be installed separately in subsystem and on Windows host

On subsystem linux:
```
npm i wsl-link -g
```
On Windows host:
```
npm i wsl-link -g
```

# Usage

On Windows start server:
```
wsl server
```
Use on subsystem linux (npm ls will be run on host Windows):
```
wsl npm ls
```

# Case

On subsystem linux setup a project (or use existing):
```
mkdir wsl-link-test
cd wsl-link-test
touch app.js
npm init
```
app.js:
```
const Nightmare = require('nightmare');

(async () => {
  await Nightmare({
    show: true
  })
  .goto('https://google.com');
})();
```
Install Windows version of Nightmare.js and run it on Windows.

```
wsl npm i nightmare --save
wsl node app
```
You should see Phantom browser open on your Windows host.

TODO: iamge
