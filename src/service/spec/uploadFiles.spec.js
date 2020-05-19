import { expect } from 'chai';

import { shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../test/IpfsDaemon';

// const { uploadFile } = require('../');

describe.skip('[FILE SYSTEM SERVICE]', function () {
  this.timeout(0);
  let fileSystemService;
  let api;

  before('start ipfs daemon and connect to ', async () => {
    // api = '/ip4/127.0.0.1/tcp/5001'; // connect to existed node API
    api = await spawnIpfsDaemon();
    // fileStorage = new FileStorage(api);
  });

  it('uploaded file should be added to `files` list in parent folder', async () => {
  });
});

after('stop the daemon', async () => {
  await shutDownIpfsDaemon();
});
