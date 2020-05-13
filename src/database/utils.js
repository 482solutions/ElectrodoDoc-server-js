const query = require('./query');

module.exports.query = query;

module.exports.getUser = async function getUser(conn, name) {
    console.log('getUser ', name);
    const result = await query(conn, `SELECT * FROM public.Users WHERE username = '${name}'`);
    return result.rows;
}

module.exports.getFolder = async function getFolder(conn, hash) {
    console.log('getFolder ', hash);
    const result = await query(conn, `SELECT * FROM public.Folders WHERE hash = '${hash}'`);
    return result.rows;
}

module.exports.getFolderByName = async function getFolderByName(conn, name) {
    console.log('getFolder by name', name);
    const result = await query(conn, `SELECT * FROM public.Folders WHERE name = '${name}'`);
    return result.rows;
}

module.exports.getFileByName = async function getFileByName(conn, name) {
    console.log('getFile by name', name);
    const result = await query(conn, `SELECT * FROM public.Files WHERE name = '${name}'`);
    return result.rows;
}

module.exports.getCerts = async function getCerts(conn, name) {
    console.log('getCerts ', name);
    const result = await query(conn, `SELECT cert FROM public.Certs WHERE username = '${name}'`);
    return result.rows;
}

module.exports.insertUser = async function insertUser(conn, name, pass, email, folder) {
    console.log('insertUser ', name, pass, email, folder);
    await query(conn, `INSERT INTO public.Users (username, password, email, folder) VALUES ('${name}', '${pass}', '${email}', '${folder}') `);
    return true;
}

module.exports.insertFolder = async function insertFolder(conn, name, hash, parentHash) {
    console.log('insertFolder ', name, hash, parentHash);
    await query(conn, `INSERT INTO public.Folders (name, hash, parentHash, folders, files) VALUES ('${name}', '${hash}', '${parentHash}', '[]', '[]' ) `);
    return true;
}

module.exports.insertFile = async function insertFile(conn, name, hash, parentHash) {
    console.log('insertFile ', name, hash, parentHash);
    await query(conn, `INSERT INTO public.Files (name, hash, parentHash) VALUES ('${name}', '${hash}', '${parentHash}' ) `);
    return true;
}

module.exports.insertCertData = async function insertCertData(conn, name, cert) {
    console.log('InsertCerts', name, cert);
    await query(conn, `INSERT INTO public.Certs (username, cert) VALUES ('${name}', '${cert}')`);
    return true;
}

module.exports.updateUser = async function updateUser(conn, name, col, value) {
    console.log('updateUser ', name, col, value);
    await query(conn, `UPDATE public.Users SET ${col} = '${value}' WHERE username = '${name}' `);
    return true;
}

module.exports.updateFolder = async function updateFolder(conn, hash, col, value) {
    console.log('updateFolder ', hash, col, value);
    await query(conn, `UPDATE public.Folders SET ${col} = '${value}' WHERE hash = '${hash}' `);
    return true;
}