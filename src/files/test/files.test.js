const { expect } = require('chai');
const { shutDownIpfsDaemon, spawnIpfsDaemon } = require('./testIpfsDaemon');
const { Files } = require('../src');

describe('[FILES]', function () {
  this.timeout(0);
  let files;
  let api;

  before('start ipfs daemon', async function () {
    // api = '/ip4/127.0.0.1/tcp/5001'; // connect to existed node API
    api = await spawnIpfsDaemon();
  });

  it.only('should connect to local ipfs node', async () => {
    files = new Files(api);
    const { version } = await files.node.version();
    expect(version).not.null;
  });

  it.only('should upload file ', async () => {
    let content = 'Hello';
    const path = await files.upload(content);
    expect(await files.getFileByHash(path)).equal(content);
  });
});

after('stop the daemon', async () => {
  await shutDownIpfsDaemon();
});

