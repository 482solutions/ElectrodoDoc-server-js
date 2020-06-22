/* eslint-disable no-restricted-syntax */
import ipfsClient from 'ipfs-http-client';
import BufferList from 'bl';

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
    let total;
    for await (const file of this.node.get(`/ipfs/${cid}`)) {
      console.log(file.path)
      if (!file.content) continue;
      const contents = new BufferList();
      for await (const chunk of file.content) {
        contents.append(chunk);
      }

      total = contents.toString('utf-8');
      console.log(total)
    }
    return total;
  }
}

export { FileStorage };
