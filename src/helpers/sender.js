import dotenv from 'dotenv';
import validator from './auth';
import DB from '../database/utils';
import configDB from '../database/configDB';
import connection from '../database/connect';

dotenv.config();
const conn = connection(configDB);

exports.sendToFabric = async (username, method, props) => {
  let response;
  let i = 1;
  const certsList = await DB.getCerts(conn, username);
  while (response === undefined || (response === null && i < 50)) {
    console.log('send to fabric ', method, i);
    // eslint-disable-next-line no-await-in-loop
    response = await validator.sendTransaction({
      identity: {
        label: username,
        certificate: certsList[0].cert,
        privateKey: certsList[0].privatekey,
        mspId: 'Org1MSP',
      },
      network: {
        channel: 'mychannel',
        chaincode: 'wodencc',
        contract: 'org.fabric.wodencontract',
      },
      transaction: {
        name: method,
        props,
      },
    });
    i++;
  }
  return response;
};
