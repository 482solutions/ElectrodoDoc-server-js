import { assert } from 'chai';
import sha256 from 'sha256';
import { generate } from 'generate-password';
// eslint-disable-next-line import/no-extraneous-dependencies
import { KEYUTIL, KJUR } from 'jsrsasign';

import { changeUser, createUser, logIn, logout, } from '../src/service/UserService';
import { changePermissions, revokePermissions,  } from '../src/service/PermissionsService';
import { CreateVoting, GetVoting, UpdateVoting  } from '../src/service/VotingService';
import {
  CreateFolder,
  GetFolder,
  UploadFile,
  DownloadFile,
  Search,
  Tree, UpdateFile,
} from '../src/service/FileSystemService';
import DB from '../src/database/utils';
import configDB from '../src/database/configDB';
import connection from '../src/database/connect';
import { createVoting } from '../src/controllers/Voting';

// eslint-disable-next-line no-buffer-constructor,max-len
const buffer = new Buffer([68, 66, 95, 72, 79, 83, 84, 61, 112, 111, 115, 116, 103, 114, 101, 115, 10, 35, 32, 68, 66, 95, 72, 79, 83, 84, 61, 49, 50, 55, 46, 48, 46, 48, 46, 49, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 35, 32, 119, 104, 101, 110, 32, 114, 117, 110, 110, 105, 110, 103, 32, 116, 104, 101, 32, 97, 112, 112, 32, 119, 105, 116, 104, 111, 117, 116, 32, 100, 111, 99, 107, 101, 114, 32, 10, 68, 66, 95, 68, 82, 73, 86, 69, 82, 61, 112, 111, 115, 116, 103, 114, 101, 115, 10, 87, 79, 68, 69, 78, 95, 74, 87, 84, 95, 83, 69, 67, 82, 69, 84, 61, 52, 56, 50, 115, 111, 108, 117, 116, 105, 111, 110, 115, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 35, 32, 85, 115, 101, 100, 32, 102, 111, 114, 32, 99, 114, 101, 97, 116, 105, 110, 103, 32, 97, 32, 74, 87, 84, 46, 32, 67, 97, 110, 32, 98, 101, 32, 97, 110, 121, 116, 104, 105, 110, 103, 10, 68, 66, 95, 85, 83, 69, 82, 61, 97, 100, 109, 105, 110, 10, 68, 66, 95, 80, 65, 83, 83, 87, 79, 82, 68, 61, 52, 56, 50, 115, 111, 108, 117, 116, 105, 111, 110, 115, 10, 68, 66, 95, 78, 65, 77, 69, 61, 119, 111, 111, 100, 101, 110, 10, 68, 66, 95, 80, 79, 82, 84, 61, 53, 52, 51, 50, 10, 67, 79, 78, 70, 73, 71, 95, 70, 73, 76, 69, 61, 46, 46, 47, 110, 101, 116, 119, 111, 114, 107, 67, 111, 110, 110, 101, 99, 116, 105, 111, 110, 46, 121, 97, 109, 108, 10, 10, 35, 32, 85, 115, 101, 100, 32, 98, 121, 32, 112, 103, 97, 100, 109, 105, 110, 32, 115, 101, 114, 118, 105, 99, 101, 32, 10, 80, 71, 65, 68, 77, 73, 78, 95, 68, 69, 70, 65, 85, 76, 84, 95, 69, 77, 65, 73, 76, 61, 107, 111, 110, 115, 116, 97, 110, 116, 105, 110, 46, 108, 121, 115, 101, 110, 107, 111, 64, 52, 56, 50, 46, 115, 111, 108, 117, 116, 105, 111, 110, 115, 10, 80, 71, 65, 68, 77, 73, 78, 95, 68, 69, 70, 65, 85, 76, 84, 95, 80, 65, 83, 83, 87, 79, 82, 68, 61, 112, 97, 115, 115, 119, 111, 114, 100, 10])
const buffer2 = new Buffer([75, 22, 43, 72, 79, 83, 84, 61, 95, 111, 37, 116, 103, 114, 101, 115, 10, 35, 32, 68, 66, 95, 72, 79, 83, 84, 61, 49, 50, 55, 46, 48, 46, 48, 46, 49, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 35, 32, 119, 104, 101, 110, 32, 114, 117, 110, 110, 105, 110, 103, 32, 116, 104, 101, 32, 97, 112, 112, 32, 119, 105, 116, 104, 111, 117, 116, 32, 100, 111, 99, 107, 101, 114, 32, 10, 68, 66, 95, 68, 82, 73, 86, 69, 82, 61, 112, 111, 115, 116, 103, 114, 101, 115, 10, 87, 79, 68, 69, 78, 95, 74, 87, 84, 95, 83, 69, 67, 82, 69, 84, 61, 52, 56, 50, 115, 111, 108, 117, 116, 105, 111, 110, 115, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 35, 32, 85, 115, 101, 100, 32, 102, 111, 114, 32, 99, 114, 101, 97, 116, 105, 110, 103, 32, 97, 32, 74, 87, 84, 46, 32, 67, 97, 110, 32, 98, 101, 32, 97, 110, 121, 116, 104, 105, 110, 103, 10, 68, 66, 95, 85, 83, 69, 82, 61, 97, 100, 109, 105, 110, 10, 68, 66, 95, 80, 65, 83, 83, 87, 79, 82, 68, 61, 52, 56, 50, 115, 111, 108, 117, 116, 105, 111, 110, 115, 10, 68, 66, 95, 78, 65, 77, 69, 61, 119, 111, 111, 100, 101, 110, 10, 68, 66, 95, 80, 79, 82, 84, 61, 53, 52, 51, 50, 10, 67, 79, 78, 70, 73, 71, 95, 70, 73, 76, 69, 61, 46, 46, 47, 110, 101, 116, 119, 111, 114, 107, 67, 111, 110, 110, 101, 99, 116, 105, 111, 110, 46, 121, 97, 109, 108, 10, 10, 35, 32, 85, 115, 101, 100, 32, 98, 121, 32, 112, 103, 97, 100, 109, 105, 110, 32, 115, 101, 114, 118, 105, 99, 101, 32, 10, 80, 71, 65, 68, 77, 73, 78, 95, 68, 69, 70, 65, 85, 76, 84, 95, 69, 77, 65, 73, 76, 61, 107, 111, 110, 115, 116, 97, 110, 116, 105, 110, 46, 108, 121, 115, 101, 110, 107, 111, 64, 52, 56, 50, 46, 115, 111, 108, 117, 116, 105, 111, 110, 115, 10, 80, 71, 65, 68, 77, 73, 78, 95, 68, 69, 70, 65, 85, 76, 84, 95, 80, 65, 83, 83, 87, 79, 82, 68, 61, 112, 97, 115, 115, 119, 111, 114, 100, 10])

const file = {
  mimetype: 'txt',
  buffer,
};

const file2 = {
  mimetype: 'image',
  buffer,
};
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

function wait(ms) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

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
    const createFolderResult = await CreateFolder(folderName,
      result.payload.folder,
      `Bearer ${result.payload.token}`);
    assert.equal(result.payload.folder, createFolderResult.payload.folder.folderHash);
  });
});

describe('Open folder', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const folderName = 'TestFolder1';
  let result;
  let folderResult;
  before('create and login user and create folder', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    folderResult = await CreateFolder(folderName, result.payload.folder, `Bearer ${result.payload.token}`);
  });

  it('should return folder to user and code 200', async () => {
    // wait(500);
    const getFolderResult = await GetFolder(folderResult.payload.folders[0].folderHash, `Bearer ${result.payload.token}`);
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
    // wait(500);
    const createFolderResult = await UploadFile(fileName,
      result.payload.folder,
      file,
      `Bearer ${result.payload.token}`);
    assert.equal(result.payload.folder, createFolderResult.payload.folder.folderHash);
  });
});

describe('Update files', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const fileName = 'TestFile';
  let result;
  let fileResult;
  before('create and login user and upload file', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    fileResult = await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
  });
  it('should update file to user and code 200', async () => {
    // wait(600);
    const getFileResult = await UpdateFile(fileResult.payload.files[0].fileHash, file2, `Bearer ${result.payload.token}`);
    assert.equal(getFileResult.code, 200);
  });
});

describe('Downloading files', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const fileName = 'TestFile';
  let result;
  let fileResult;
  before('create and login user and upload file', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    fileResult = await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
  });
  it('should return file to user and code 200', async () => {
    // wait(600);
    const getFileResult = await DownloadFile(fileResult.payload.files[0].fileHash, null, `Bearer ${result.payload.token}`);
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
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
  });

  it('should return code 200 when correct user logout', async () => {
    result = await logout(`Bearer ${result.payload.token}`);
    assert.equal(result.code, 200);
  });
});

describe('Tree folder', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const folderName = 'TestFolder1';
  const folderName2 = 'TestFolder2';
  const folderName3 = 'TestFolder3';
  let result;
  let folder1;
  let folder2;
  let folder3;
  before('create and login user and create folders', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    // wait(400);
    folder1 = await CreateFolder(folderName,
      result.payload.folder,
      `Bearer ${result.payload.token}`);
    folder2 = await CreateFolder(folderName2,
      folder1.payload.folders[0].folderHash,
      `Bearer ${result.payload.token}`);
    folder3 = await CreateFolder(folderName3,
      folder2.payload.folders[0].folderHash,
      `Bearer ${result.payload.token}`);
     // console.log(folder1);
  });
  it('should return folder tree to user and code 200', async () => {
    const getFolderResult = await Tree(`Bearer ${result.payload.token}`);
    assert.equal(getFolderResult.code, 200);
    assert.equal(getFolderResult.payload.response.folders[0].folders[0].folders[0].name, folder3.payload.folders[0].folderName);
  });
});


describe('Change ownership of files', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const login2 = getLogin();
  const csr2 = getCSR(login2);
  const fileName = 'TestFile';
  let result;
  let fileResult;
  before('create and login user and upload file', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    await createUser(login2, 'test2@gmail.com', password, csr2.privateKeyPem, csr2.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    fileResult = await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
  });
  it('should change owner of file to login2 and return code 200', async () => {
    // wait(100);
    const permissionResult = await changePermissions(login2, fileResult.payload.files[0].fileHash, 'owner', `Bearer ${result.payload.token}`);
    assert.equal(permissionResult.code, 200);
    assert.equal(permissionResult.payload.response.ownerId, login2);
  });
});

describe('Change permissions of files', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const login2 = getLogin();
  const csr2 = getCSR(login2);
  const fileName = 'TestFile';
  let result;
  let fileResult;
  before('create and login user and upload file', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    await createUser(login2, 'test2@gmail.com', password, csr2.privateKeyPem, csr2.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    fileResult = await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
  });
  it('should change permissions of file to login2 and return code 200', async () => {
    // wait(100);
    const permissionResult = await changePermissions(login2, fileResult.payload.files[0].fileHash, 'write', `Bearer ${result.payload.token}`);
    assert.equal(permissionResult.code, 200);
    assert.equal(permissionResult.payload.response.writeUsers[0], login2);
  });
});

describe('Revoke permissions of files', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const login2 = getLogin();
  const csr2 = getCSR(login2);
  const fileName = 'TestFile';
  let result;
  let fileResult;
  before('create and login user and upload file', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    await createUser(login2, 'test2@gmail.com', password, csr2.privateKeyPem, csr2.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    fileResult = await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
    await changePermissions(login2, fileResult.payload.files[0].fileHash, 'write', `Bearer ${result.payload.token}`);
  });
  it('should revoke permissions file from login2 and return code 200', async () => {
    // wait(100);
    const permissionResult = await revokePermissions(login2, fileResult.payload.files[0].fileHash, 'unwrite', `Bearer ${result.payload.token}`);
    assert.equal(permissionResult.code, 200);
    assert.equal(permissionResult.payload.response.writeUsers.length, 0);
  });
});

describe('Create voting', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const login2 = getLogin();
  const csr2 = getCSR(login2);
  const fileName = 'TestFile';
  let result;
  let fileResult;
  before('create and login user and upload file', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    await createUser(login2, 'test2@gmail.com', password, csr2.privateKeyPem, csr2.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    fileResult = await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
    await changePermissions(login2, fileResult.payload.files[0].fileHash, 'write', `Bearer ${result.payload.token}`);
  });
  it('should create voting and return code 201', async () => {
    // wait(100);
    const createVotingResult = await CreateVoting(fileResult.payload.files[0].fileHash, "123123212323", ['yes', 'no'], "[]", 'voting1', `Bearer ${result.payload.token}`);
    assert.equal(createVotingResult.code, 201);
    assert.equal(createVotingResult.payload.response[0].description, 'voting1');
  });
});

describe('Get voting', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const login2 = getLogin();
  const csr2 = getCSR(login2);
  const fileName = 'TestFile';
  let result;
  let createVotingResult;
  before('create and login user and upload file', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    await createUser(login2, 'test2@gmail.com', password, csr2.privateKeyPem, csr2.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    const fileResult = await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
    await changePermissions(login2, fileResult.payload.files[0].fileHash, 'write', `Bearer ${result.payload.token}`);
    createVotingResult = await CreateVoting(fileResult.payload.files[0].fileHash, "123123212323", ['yes', 'no'], "[]", 'voting1', `Bearer ${result.payload.token}`);

  });
  it('should get voting and return code 200', async () => {
    // wait(100);
    const getVotingResult = await GetVoting(`Bearer ${result.payload.token}`);
    assert.equal(getVotingResult.code, 200);
    assert.equal(createVotingResult.payload.response[0].votingHash, getVotingResult.payload.response[0].votingHash);
  });
});
describe('Update voting', async () => {
  const login = getLogin();
  const csr = getCSR(login);
  const password = sha256('password');
  const login2 = getLogin();
  const csr2 = getCSR(login2);
  const fileName = 'TestFile';
  let result;
  let createVotingResult;
  before('create and login user and upload file', async () => {
    await createUser(login, 'test@gmail.com', password, csr.privateKeyPem, csr.csrPem);
    await createUser(login2, 'test2@gmail.com', password, csr2.privateKeyPem, csr2.csrPem);
    const userCert = (await DB.getCerts(conn, login))[0];
    result = await logIn(login, password, userCert.cert, csr.privateKeyPem);
    const fileResult = await UploadFile(fileName, result.payload.folder, file, `Bearer ${result.payload.token}`);
    await changePermissions(login2, fileResult.payload.files[0].fileHash, 'write', `Bearer ${result.payload.token}`);
    createVotingResult = await CreateVoting(fileResult.payload.files[0].fileHash, "123123212323", ['yes', 'no'], "[]", 'voting1', `Bearer ${result.payload.token}`);
  });
  it('should update vote of user and return code 200', async () => {
    // wait(100);
    const updateVotingResult = await UpdateVoting(createVotingResult.payload.response[0].votingHash, 'yes', `Bearer ${result.payload.token}`);
    assert.equal(updateVotingResult.code, 200);
    assert.equal(updateVotingResult.payload.response.voters[1].vote, 'yes');
  });
});