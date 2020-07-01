import fs from 'fs';
import path from 'path';
import http from 'http';
import cors from 'cors';
import connect from 'connect';
import swaggerTools from 'swagger-tools';
import jsyaml from 'js-yaml';
import dotenv from 'dotenv';
import auth from './helpers/auth';
import initDB from './utils/initdb';

const app = connect();
const serverPort = 1823;
dotenv.config();
// in debug just comment this code
initDB().then(() => {
  console.log('DB successfully initiated');
}).catch(
  () => {
    console.log('Failed to initiate db');
  },
);
// swaggerRouter configuration
const options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  // useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};
app.use(cors());
// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);
swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter(options));
  app.use(middleware.swaggerUi());
  app.use(
    middleware.swaggerSecurity({
      Bearer: auth.verifyToken,
    }),
  );
  // Start the server
  http.createServer(app).listen(serverPort, () => {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});
