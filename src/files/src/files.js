/* eslint-disable no-restricted-syntax */
const ipfsClient = require('ipfs-http-client');
const BufferList = require('bl');

class Files {

  /**
   * @param uri {string} - IPFS API server uri
   */
  constructor(uri) {
    this.node = ipfsClient(uri);
  }

  async add(path, content) {
    const chunks = await this.node.files.write(path, content);
    let cid;
    for await (const chunk of chunks) {
      cid = chunk.cid; // return cid from last (and only one) chunk
    }
    return cid.toString();
  }

  /**
   * @param uri {string} CID of the file with claim content
   */
  // async get(uri: string): Promise<string> {
  //   let claim = '';
  //   for await (const file of this.node.get(`/ipfs/${uri}`)) {
  //     const content = new BufferList();
  //     for await (const chunk of file.content) {
  //       content.append(chunk);
  //     }
  //     claim += content.toString();
  //   }
  //   return claim;
  // }

  // async delete(uri: string): Promise<boolean> {
  //   throw new Error('Not supported by IPFS');
  // }
}

module.exports.Files = Files;
