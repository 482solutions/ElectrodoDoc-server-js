import query from './query';

module.exports.query = query;

module.exports.getUser = async function getUser(conn, name) {
  const result = await query(conn, `SELECT * FROM public.Users WHERE username = '${name}'`);
  return result.rows;
};
module.exports.getUserByEmail = async function getUser(conn, email) {
  const result = await query(conn, `SELECT * FROM public.Users WHERE email = '${email}'`);
  return result.rows;
};

module.exports.getFolderByName = async function getFolderByName(conn, name) {
  const result = await query(conn, `SELECT * FROM public.Folders WHERE name LIKE '%${name}%'`);
  return result.rows;
};

module.exports.getFileByName = async function getFileByName(conn, name) {
  const result = await query(conn, `SELECT * FROM public.Files WHERE name LIKE '%${name}%'`);
  return result.rows;
};

module.exports.getCerts = async function getCerts(conn, name) {
  const result = await query(conn, `SELECT * FROM public.Certs WHERE username = '${name}'`);
  return result.rows;
};

module.exports.insertUser = async function insertUser(conn, name, pass, email, folder) {
  await query(conn, `INSERT INTO public.Users (username, password, email, folder) VALUES ('${name}', '${pass}', '${email}', '${folder}') `);
  return true;
};

module.exports.insertFolder = async function insertFolder(conn, name, hash) {
  await query(conn, `INSERT INTO public.Folders (name, hash) VALUES ('${name}', '${hash}') `);
  return true;
};

module.exports.insertFile = async function insertFile(conn, name, hash) {
  await query(conn,
    `INSERT INTO public.Files (name, hash) VALUES ('${name}', '${hash}')`);
  return true;
};

module.exports.insertCertData = async function insertCertData(conn, name, cert, privateKey) {
  await query(conn, `INSERT INTO public.Certs (username, cert, privateKey) VALUES ('${name}', '${cert}', '${privateKey}')`);
  return true;
};

module.exports.updateUser = async function updateUser(conn, name, col, value) {
  await query(conn, `UPDATE public.Users SET ${col} = '${value}' WHERE username = '${name}' `);
  return true;
};

module.exports.updateFolder = async function updateFolder(conn, hash, col, value) {
  await query(conn, `UPDATE public.Folders SET ${col} = '${value}' WHERE hash = '${hash}' `);
  return true;
};
