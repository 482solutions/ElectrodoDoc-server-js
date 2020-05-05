const query = require('./query');

module.exports.query = query;

module.exports.getUser = async function getUser(conn, name) {
    console.log('getUser ', name);
    const result = await query(conn, `SELECT * FROM public.Users WHERE username = '${name}'`);
    return result.rows;
}

module.exports.getCerts = async function getCerts(conn, name) {
    console.log('getCerts ', name);
    const result = await query(conn, `SELECT cert FROM public.Certs WHERE username = '${name}'`);
    return result.rows;
}

module.exports.insertUser = async function insertUser(conn, name, pass, email) {
    console.log('insertUser ', name, pass, email);
    await query(conn, `INSERT INTO public.Users (username, password, email) VALUES ('${name}', '${pass}', '${email}') `);
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
