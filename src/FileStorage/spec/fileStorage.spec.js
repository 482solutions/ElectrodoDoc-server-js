const { expect } = require('chai');
const { shutDownIpfsDaemon, spawnIpfsDaemon } = require('../../../test/IpfsDaemon');
const { FileStorage } = require('../src');

describe('[FILE STORAGE]', function () {
  this.timeout(0);
  let fileStorage;
  let api;

  before('start ipfs daemon', async function () {
    // api = '/ip4/127.0.0.1/tcp/5001'; // connect to existed node API
    api = await spawnIpfsDaemon();
    fileStorage = new FileStorage(api);
  });

  it('should connect to local ipfs node', async () => {
    const { version } = await fileStorage.node.version();
    expect(version).not.null;
  });

  it('should upload file ', async () => {
    let content = 'Hello';
    const cid = await fileStorage.upload(content);
    expect(await fileStorage.getFileByHash(cid)).equal(content);
  });
});

after('stop the daemon', async () => {
  await shutDownIpfsDaemon();
});

