/* eslint-disable no-restricted-syntax */
const ipfsClient = require('ipfs-http-client');

class Files {

  /**
   * @param uri {string|object} - IPFS API server
   */
  constructor(uri) {
    this.node = ipfsClient(uri);
  }
}

module.exports.Files = Files;
