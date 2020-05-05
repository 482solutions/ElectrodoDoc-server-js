const ResponsePayload = function (code, payload) {
    this.code = code;
    this.payload = payload;
};

exports.respondWithCode = function (code, payload) {
    return new ResponsePayload(code, payload);
}

const writeJson = exports.writeJson = function (response, arg1, arg2) {
    let code;
    let payload;
    console.log("1 | Arg1:", arg1, "Arg2:", arg2);
    if (arg1 && !arg2 && 'code' in arg1 && 'payload' in arg1) {
        writeJson(response, arg1.payload, arg1.code);
        return;
    }
    console.log("2 | Arg1:", arg1, "Arg2:", arg2);
    if (arg2 && Number.isInteger(arg2)) {
        code = arg2;
    } else {
        if (arg1 && Number.isInteger(arg1)) {
            code = arg1;
        }
    }
    if (code && arg1) {
        payload = arg1;
    } else if (arg1) {
        payload = arg1;
    }
    console.log(code)
    if (!code) {
        // if no response code given, we default to 200
        code = 200;
    }
    if (typeof payload === 'object') {
        payload = JSON.stringify(payload, null, 2);
    }
    response.writeHead(code, {'Content-Type': 'application/json'});
    response.end(payload);
};
