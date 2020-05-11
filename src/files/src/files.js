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

  /**
   * Uploads contents of a single file
   * 
   * @param {String|Buffer} contents 
   */
  async upload(contents) {
    let cid;
    for await (let chunk of this.node.add(contents)) {
      ({ cid } = chunk)
    }
    return cid;
  }

  /**
   * Retrieves the contents of a single file
   * 
   * @param {String|CID} hash 
   */
  async getFileByHash(hash) {
    let total = '';
    for await (const file of this.node.get(`/ipfs/${hash}`)) {
      const contents = new BufferList();
      for await (const chunk of file.content) {
        contents.append(chunk);
      }
      total += contents.toString();
    }
    return total;
  }
}

module.exports.Files = Files;
