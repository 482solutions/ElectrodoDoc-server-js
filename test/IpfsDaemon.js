const Ctl = require('ipfsd-ctl');
const path = require('path');
const ipfsHttpModule = require('ipfs-http-client');

let ipfsd;

async function spawnIpfsDaemon() {
  const ipfsBin = path.resolve(__dirname, '../../../', 'node_modules/.bin', 'jsipfs');
  ipfsd = await Ctl.createController({
    type: 'js', disposable: true, test: true, ipfsBin, ipfsHttpModule,
  });
  return ipfsd.apiAddr;
}

async function shutDownIpfsDaemon() {
  return ipfsd && ipfsd.stop();
}

module.exports = { spawnIpfsDaemon, shutDownIpfsDaemon }
