/* eslint-disable no-restricted-syntax */
const ipfsClient = require('ipfs-http-client');

class Files {

  /**
   * @param uri {string|object} - IPFS API server
   */
  constructor(uri) {
    this.node = ipfsClient(uri);
  }

  async upload(path, content) {
    await this.node.files.write(path, Buffer.from(content), { create: true });
  }
}

module.exports.Files = Files;
