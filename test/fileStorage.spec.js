// import { expect } from 'chai';
// import Ctl from 'ipfsd-ctl';
// import path from 'path';
// import ipfsHttpModule from 'ipfs-http-client';
// import { FileStorage } from '..';
//
// let ipfsd;
//
// async function spawnIpfsDaemon() {
//   const ipfsBin = path.resolve(__dirname, '../', 'node_modules/.bin', 'jsipfs');
//   ipfsd = await Ctl.createController({
//     type: 'js', disposable: true, test: true, ipfsBin, ipfsHttpModule,
//   });
//   return ipfsd.apiAddr;
// }
//
// async function shutDownIpfsDaemon() {
//   return ipfsd && ipfsd.stop();
// }
//
// describe('[FILE STORAGE]', function () {
//   this.timeout(0);
//   let fileStorage;
//   let api;
//
//   before('start ipfs daemon', async () => {
//     // api = '/ip4/127.0.0.1/tcp/5001'; // connect to existed node API
//     api = await spawnIpfsDaemon();
//     fileStorage = new FileStorage(api);
//   });
//
//   it('should connect to local ipfs node', async () => {
//     const { version } = await fileStorage.node.version();
//     expect(version).not.null;
//   });
//
//   it('should upload file ', async () => {
//     const content = 'Hello';
//     const cid = await fileStorage.upload(content);
//     expect(await fileStorage.getFileByHash(cid)).equal(content);
//   });
// });
//
// after('stop the daemon', async () => {
//   await shutDownIpfsDaemon();
// });
