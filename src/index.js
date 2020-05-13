'use strict';

const fs = require('fs'),
  path = require('path'),
  http = require('http');
const cors = require('cors');
const app = require('connect')();
const auth = require("./helpers/auth");
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const dotenv = require('dotenv');
const serverPort = 8080;

const initDB = require('./database/initdb');
dotenv.config();

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
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());
  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
  app.use(
      middleware.swaggerSecurity({
        //manage token function in the 'auth' module
        Bearer: auth.verifyToken
      })
  );
  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});
