import { assert } from 'chai';
import sha256 from 'sha256';
import { generate } from 'generate-password';
// eslint-disable-next-line import/no-extraneous-dependencies
import { KEYUTIL, KJUR } from 'jsrsasign';

import {
  changeUser,
  createUser,
  logIn,
  logout,
} from '../src/service/UserService';
import {
  CreateFolder,
  DownloadFile,
  GetFolder,
  Search,
  UploadFile,
} from '../src/service/FileSystemService';
import DB from '../src/database/utils';
import configDB from '../src/database/configDB';
import connection from '../src/database/connect';

// eslint-disable-next-line no-buffer-constructor
const file = new Buffer([68, 66, 95, 72, 79, 83, 84, 61, 112, 111, 115, 116, 103, 114, 101, 115, 10, 35, 32, 68, 66, 95, 72, 79, 83, 84, 61, 49, 50, 55, 46, 48, 46, 48, 46, 49, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 35, 32, 119, 104, 101, 110, 32, 114, 117, 110, 110, 105, 110, 103, 32, 116, 104, 101, 32, 97, 112, 112, 32, 119, 105, 116, 104, 111, 117, 116, 32, 100, 111, 99, 107, 101, 114, 32, 10, 68, 66, 95, 68, 82, 73, 86, 69, 82, 61, 112, 111, 115, 116, 103, 114, 101, 115, 10, 87, 79, 68, 69, 78, 95, 74, 87, 84, 95, 83, 69, 67, 82, 69, 84, 61, 52, 56, 50, 115, 111, 108, 117, 116, 105, 111, 110, 115, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 35, 32, 85, 115, 101, 100, 32, 102, 111, 114, 32, 99, 114, 101, 97, 116, 105, 110, 103, 32, 97, 32, 74, 87, 84, 46, 32, 67, 97, 110, 32, 98, 101, 32, 97, 110, 121, 116, 104, 105, 110, 103, 10, 68, 66, 95, 85, 83, 69, 82, 61, 97, 100, 109, 105, 110, 10, 68, 66, 95, 80, 65, 83, 83, 87, 79, 82, 68, 61, 52, 56, 50, 115, 111, 108, 117, 116, 105, 111, 110, 115, 10, 68, 66, 95, 78, 65, 77, 69, 61, 119, 111, 111, 100, 101, 110, 10, 68, 66, 95, 80, 79, 82, 84, 61, 53, 52, 51, 50, 10, 67, 79, 78, 70, 73, 71, 95, 70, 73, 76, 69, 61, 46, 46, 47, 110, 101, 116, 119, 111, 114, 107, 67, 111, 110, 110, 101, 99, 116, 105, 111, 110, 46, 121, 97, 109, 108, 10, 10, 35, 32, 85, 115, 101, 100, 32, 98, 121, 32, 112, 103, 97, 100, 109, 105, 110, 32, 115, 101, 114, 118, 105, 99, 101, 32, 10, 80, 71, 65, 68, 77, 73, 78, 95, 68, 69, 70, 65, 85, 76, 84, 95, 69, 77, 65, 73, 76, 61, 107, 111, 110, 115, 116, 97, 110, 116, 105, 110, 46, 108, 121, 115, 101, 110, 107, 111, 64, 52, 56, 50, 46, 115, 111, 108, 117, 116, 105, 111, 110, 115, 10, 80, 71, 65, 68, 77, 73, 78, 95, 68, 69, 70, 65, 85, 76, 84, 95, 80, 65, 83, 83, 87, 79, 82, 68, 61, 112, 97, 115, 115, 119, 111, 114, 100, 10]);
const conn = connection(configDB);
const getCSR = (userData) => {
  const kp = KEYUTIL.generateKeypair('EC', 'secp256r1');
  const privateHex = kp.prvKeyObj.prvKeyHex;

  const privateKeyPem = KEYUTIL.getPEM(kp.prvKeyObj, 'PKCS8PRV');
  const publicKeyPem = KEYUTIL.getPEM(kp.pubKeyObj, 'PKCS8PUB');
  const username = userData;
  const country = 'UA';
  const state = 'Odessa';
  const city = 'Odessa';
  //-----------------
  const csrPem = KJUR.asn1.csr.CSRUtil.newCSRPEM({
    subject: { str: `/CN=${username}/C=${country}/ST=${state}/O=Hyperledger/OU=Fabric/L=${city}` },
    ext: [
      { subjectAltName: { array: [{ dns: 'domain.net' }] } },
    ],
    sbjpubkey: publicKeyPem,
    sigalg: 'SHA256withECDSA',
    sbjprvkey: privateKeyPem,
  });
  return { csrPem, privateHex, privateKeyPem };
};

function getLogin() {
  return generate({
    length: 10,
    lowercase: true,
    uppercase: true,
  });
}

describe('User Registration', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');

  it('should return created user from database', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userFromDB = (await DB.getUser(conn, login))[0];
    assert.equal(login, userFromDB.username);
  });
});

describe('User Login', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');

  before('Create user', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
  });

  it('should return code 200 when correct user login to system', async () => {
    const userCert = (await DB.getCerts(conn, login))[0];
    const result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    assert.equal(result.code, 200);
  });
});

describe('User password changing', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  let result;

  before('Create and login user ', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
  });

  it('should return new password from database after changing', async () => {
    const newPassword = sha256('newPassword');
    await changeUser(password, newPassword, `Bearer ${result.payload.token}`);
    const userFromDB = (await DB.getUser(conn, login))[0];
    assert.equal(newPassword, userFromDB.password);
  });
});

describe('Creating Folder', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  let result;

  before('create and login user', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
  });

  it('should return new folder to database', async () => {
    const folderName = 'newFolder';
    const createFolderResult = await CreateFolder(folderName, result.payload.folder, `Bearer ${result.payload.token}`);
    assert.equal(result.payload.folder, createFolderResult.payload.folder.folderHash);
  });
});

describe('Open folder', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const folderName = 'TestFolder1';
  let result;
  let folderFromDB = {};

  before('create and login user and create folder', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    await CreateFolder(folderName, result.payload.folder, `Bearer ${result.payload.token}`);
    folderFromDB = (await DB.getFolderByName(conn, folderName))[0];
  });

  it ('should return folder to user and code 200', async () => {
    const getFolderResult = await GetFolder(folderFromDB.hash, `Bearer ${result.payload.token}`);
    assert.equal(getFolderResult.code, 200);
  });
});

describe('Uploading files', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  let result;

  before('create and login user', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
  });

  it('should return new file to database', async () => {
    const fileName = 'newFile';
    const createFolderResult = await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
    assert.equal(result.payload.folder, createFolderResult.payload.folder.folderHash);
  });
});

describe('Downloading files', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const fileName = 'TestFile';
  let result;
  let fileFromDB = {};

  before('create and login user and create folder', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
    fileFromDB = (await DB.getFileByName(conn, fileName))[0];
  });

  it('should return file to user and code 200', async () => {
    const getFileResult = await DownloadFile(fileFromDB.hash, `Bearer ${result.payload.token}`);
    assert.equal(getFileResult.code, 200);
  });
});

describe('Search', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const folderName = 'TestFolderSearch';
  let result;

  before('create and login user and create folder', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    await CreateFolder(folderName, result.payload.folder, `Bearer ${result.payload.token}`);
  });

  it('should return result of search to user and code 200', async () => {
    const getSearchResult = await Search(folderName, `Bearer ${result.payload.token}`);
    assert.equal(getSearchResult.code, 200);
  });
});

describe('User logout', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  let result;

  before('create and login user', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    console.log(userCert)
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
  });

  it('should return code 200 when correct user logout', async () => {
    result = await logout(`Bearer ${result.payload.token}`);
    console.log(result)
    assert.equal(result.code, 200);
  });
});
