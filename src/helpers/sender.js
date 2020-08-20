import dotenv from 'dotenv';
import validator from './auth';
import DB from '../database/utils';
import configDB from '../database/configDB';
import connection from '../database/connect';

dotenv.config();
const conn = connection(configDB);

exports.sendToFabric = async (username, method, props) => {
  const certsList = await DB.getCerts(conn, username);
  let response;
  try {
    response = await validator.sendTransaction({
      identity: {
        label: username,
        certificate: certsList[0].cert,
        privateKey: certsList[0].privatekey,
        mspId: '482solutions',
      },
      network: {
        channel: 'testchannel',
        chaincode: 'wodencc',
        contract: 'org.fabric.wodencontract',
      },
      transaction: {
        name: method,
        props,
      },
    });
  } catch (error) {
    if (error.message.search('MVCC_READ_CONFLICT') !== -1) {
      console.log('send to fabric retry');
      await this.sendToFabric(username, method, props);
    } else {
      console.log(error);
      response = error;
    }
  }
  return response;
};
