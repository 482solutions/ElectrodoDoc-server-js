const connection = require('./connect');
const dbrequestor = require('./utils');
const configDB = require('./configDB');


async function initdb() {
    const conn = connection(configDB);
    await dbrequestor.query(conn, 'SET default_tablespace = \'\';');
    await dbrequestor.query(conn, 'DROP TABLE certs');
    await dbrequestor.query(conn, 'DROP TABLE users');
    await dbrequestor.query(conn, `CREATE TABLE public.certs (username character varying(100), cert character varying(2048));`);
    await dbrequestor.query(conn, 'ALTER TABLE public.certs OWNER TO admin;');
    await dbrequestor.query(conn, `CREATE TABLE public.users (
      username character varying(100) NOT NULL,
      email character varying(100) NOT NULL,
      password character varying(70),
      csr character varying(1024),
      enrollmentSecret character varying(70) );`);
    await dbrequestor.query(conn, 'ALTER TABLE public.users OWNER TO admin;');
    await dbrequestor.query(conn, `ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (username);`);
    await dbrequestor.query(conn, `ALTER TABLE ONLY public.certs ADD CONSTRAINT certs_name_fkey FOREIGN KEY (username) REFERENCES public.users(username);`);
    await dbrequestor.query(conn, "INSERT INTO public.users VALUES ('user1', 'password', 'email@mail.com')");
}
module.exports = initdb;
