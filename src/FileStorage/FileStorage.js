/* eslint-disable no-restricted-syntax */
import ipfsClient from 'ipfs-http-client';

class FileStorage {
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
   *
   * @returns {CID}
   */
  async upload(contents) {
    let cid;
    for await (const chunk of this.node.add(contents)) {
      ({ cid } = chunk);
    }
    return cid;
  }

  /**
   * Retrieves contents of a single file
   *
   * @param {String|CID} cid
   *
   * @returns {String}
   */
  async getFileByHash(cid) {
    const chunks = [];
    for await (const chunk of this.node.cat(cid)) {
      chunks.push(chunk);
    }
    const file = Buffer.concat(chunks);
    return file;
  }
}

export { FileStorage };
