import dotenv from 'dotenv';
import validator from './auth';
import DB from '../database/utils';
import configDB from '../database/configDB';
import connection from '../database/connect';

dotenv.config();
const conn = connection(configDB);

exports.sendToFabric = async (username, method, props) => {
  const certsList = await DB.getCerts(conn, username);
  const response = await validator.sendTransaction({
    identity: {
      label: username,
      certificate: certsList[0].cert,
      privateKey: certsList[0].privatekey,
      mspId: '482solutions',
    },
    network: {
      channel: 'testchannel',
      chaincode: 'electricitycc',
      contract: 'org.fabric.marketcontract',
    },
    transaction: {
      name: method,
      props,
    },
  });
  return response;
};
