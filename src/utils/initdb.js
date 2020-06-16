import connection from '../database/connect';
import dbrequestor from '../database/utils';
import configDB from '../database/configDB';

async function initdb() {
  const conn = connection(configDB);
  await dbrequestor.query(conn, 'SET default_tablespace = \'\';');
  await dbrequestor.query(conn, 'DROP TABLE IF EXISTS certs');
  await dbrequestor.query(conn, 'DROP TABLE IF EXISTS users');
  await dbrequestor.query(conn, 'DROP TABLE IF EXISTS folders');
  await dbrequestor.query(conn, 'DROP TABLE IF EXISTS files');
  await dbrequestor.query(conn, 'CREATE TABLE public.certs (username character varying(100), cert character varying(2048), privateKey character varying(2048));');
  await dbrequestor.query(conn, 'ALTER TABLE public.certs OWNER TO admin;');
  await dbrequestor.query(conn, `CREATE TABLE public.users (
      username character varying(100) NOT NULL,
      email character varying(100) NOT NULL,
      password character varying(70),
      folder character varying(100) );`);
  await dbrequestor.query(conn, `CREATE TABLE public.folders (
      name character varying(100) NOT NULL,
      hash character varying(100) NOT NULL);`);
  await dbrequestor.query(conn, `CREATE TABLE public.files (
      name character varying(100) NOT NULL,
      hash character varying(100) NOT NULL);`);
  await dbrequestor.query(conn, 'ALTER TABLE public.users OWNER TO admin;');
  await dbrequestor.query(conn, 'ALTER TABLE public.folders OWNER TO admin;');
  await dbrequestor.query(conn, 'ALTER TABLE public.files OWNER TO admin;');
  await dbrequestor.query(conn, 'ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (username);');
  await dbrequestor.query(conn, 'ALTER TABLE ONLY public.certs ADD CONSTRAINT certs_name_fkey FOREIGN KEY (username) REFERENCES public.users(username);');
  await dbrequestor.query(conn, "INSERT INTO public.users VALUES ('user1', 'password', 'email@mail.com')");
}
module.exports = initdb;
