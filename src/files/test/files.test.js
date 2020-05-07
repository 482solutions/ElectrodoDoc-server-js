/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { expect } = require('chai');
const fs = require('fs');
const { shutDownIpfsDaemon, spawnIpfsDaemon } = require('./testIpfsDaemon');
const { Files } = require('../src');

describe('[FILES]', function () {
  this.timeout(0);
  let api;
  let files;

  before('start ipfs daemon', async function () {
    // api = '/ip4/127.0.0.1/tcp/5001';
    api = await spawnIpfsDaemon();
  });

  it.only('should connect to ipfs api', async () => {
    files = new Files(api);
    const { version } = await files.node.version();
    expect(version).not.null;
  })

  after('stop the daemon', async () => {
    await shutDownIpfsDaemon();
  });
});


