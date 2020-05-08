/* eslint-disable no-restricted-syntax */
const ipfsClient = require('ipfs-http-client');
const BufferList = require('bl');

class Files {

  /**
   * @param uri {string|object} - IPFS API server
   */
  constructor(uri) {
    this.node = ipfsClient(uri);
  }

  async upload(content) {
    let path;
    for await (let chunk of this.node.add(content)) {
      ({ path } = chunk)
    }
    return path;
  }

  async getFileByHash(hash) {
    let total = '';
    for await (const file of this.node.get(`/ipfs/${hash}`)) {
      const content = new BufferList();
      for await (const chunk of file.content) {
        content.append(chunk);
      }
      total += content.toString();
    }
    return total;
  }
}

module.exports.Files = Files;
