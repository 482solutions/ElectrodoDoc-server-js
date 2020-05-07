/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { expect } = require('chai');
const fs = require('fs');
// import { shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';
const { Files } = require('../src');

describe('[FILES]', function () {
  this.timeout(0);

  // before('start ipfs daemon', async function () {
  //   const api = await spawnIpfsDaemon();
  //   this.store = new DidStore(api);
  // });

  it.only('should connect to local ipfs node', async () => {
    const apiUrl = '/ip4/127.0.0.1/tcp/5001';
    const files = new Files(apiUrl);
    const { version } = await files.node.version();
    // console.log('>>> ipfs verison: ', version);
    expect(version).not.null;
  })

  it('get() should fetch claim by uri returned from save()', async function () {
    const claim = 'TEST CLAIM';
    const cid = await this.store.save(claim);
    const stored = await this.store.get(cid);
    expect(stored).equal(claim);
  });

  it('get() should fetch a big claim by uri returned from save()', async function () {
    const claim = fs.readFileSync('./test/big-claim.txt').toString('utf8');
    const cid = await this.store.save(claim);
    const stored = await this.store.get(cid);
    expect(stored).equal(claim);
  });

  // after('stop the daemon', async () => {
  //   await shutDownIpfsDaemon();
  // });
});


