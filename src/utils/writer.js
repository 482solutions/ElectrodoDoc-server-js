const ResponsePayload = function ResponsePayload(code, payload) {
  this.code = code;
  this.payload = payload;
};

exports.respondWithCode = function respondWithCode(code, payload) {
  return new ResponsePayload(code, payload);
};

exports.writeJson = function writeJson(response, arg1, arg2) {
  let code;
  let payload;
  if (arg1 && !arg2 && 'code' in arg1 && 'payload' in arg1) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }
  if (arg2 && Number.isInteger(arg2)) {
    code = arg2;
  } else if (arg1 && Number.isInteger(arg1)) {
    code = arg1;
  }
  if (code && arg1) {
    payload = arg1;
  } else if (arg1) {
    payload = arg1;
  }
  if (!code) {
    // if no response code given, we default to 200
    code = 200;
  }

  if (typeof payload === 'object' && !payload.type) {
    payload = JSON.stringify(payload, null, 2);
  }

  if (payload.type) {
    if (payload.type === 'image/svg+xml') {
      response.writeHead(code, {
        'Content-Type': 'multipart/form-data',
        'X-Content-Type-Options': payload.name,
      });
    } else {
      response.writeHead(code, {
        'Content-Type': payload.type,
        'X-Content-Type-Options': payload.name,
      });
    }
    payload = payload.file;
  } else {
    response.writeHead(code, { 'Content-Type': 'application/json' });
  }
  response.end(payload);
};
