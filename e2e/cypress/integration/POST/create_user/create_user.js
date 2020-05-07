import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { sha256 } from 'js-sha256';
import { generate } from 'generate-password'
import { getLogin, getPassword } from '../../../support/commands'
import { objectToFormData } from 'object-to-formdata';
import { getCSR } from '../../../support/csr'
const request = require('@cypress/request');
const basic = 'api/v1/user'
// const headers = {
//   // 'content-type': 'application/json',
//   'content-type': 'multipart/form-data; boundary=--------------------------',
//   'accept': 'application/json'
// }

let user
let login
let email
let password

beforeEach('Get user data', () => {
  login = getLogin()
  password = getPassword()
  email = login + '@gmail.com'
})

Then(/^I got response status 201$/, () => {
  expect(201).to.eq(user.status)
})

Then(/^I got response status 409$/, () => {
  expect(409).to.eq(user.status)
})

Then(/^I got response status 422$/, () => {
  expect(422).to.eq(user.status)
})

Then(/^Error Required Username$/, () => {
  expect('{"error":"Required Username"}\n').to.eq(user.body)
})

Then(/^Error Required Email$/, () => {
  expect('{"error":"Required Email"}\n').to.eq(user.body)
})

Then(/^Error Required Password$/, () => {
  expect('{"error":"Required Password"}\n').to.eq(user.body)
})

Then(/^Error Invalid Email$/, () => {
  expect('{"error":"Invalid Email"}\n').to.eq(user.body)
})

Then(/^There is no token$/, () => {
  expect('').to.eq(user.body.token)
})




// -----------------------------------------------------------------------------------

Given(/^I send request for "POST" user$/, async () => {
  let name = generate({
    length: 21,
    lowercase: true,
    uppercase: true,
    symbols: false,
    numbers: false
  })
  // let double = name + "  " + name
  cy.log(name)
  const  csr = await getCSR(name);
  cy.log(csr.csrPem)
  cy.log(csr.privateHex)
  cy.log(csr.privateKeyPem)

  // let formData = {
  //   login: 'Asdfgh',
  //   email: 'asdfgh@gmail.com',
  //   password: 'asdfgh12345',
  //   CSR: ''
  // }
  // request.post({url:'http://localhost:8080/api/v1/user', formData: formData}, function optionalCallback(err, httpResponse, body) {
  //   if (err) {
  //     return console.error('upload failed:', err);
  //   }
  //   console.log('Upload successful!  Server responded with:', body);
  // });

  // var options = {
  //   'method': 'POST',
  //   'url': 'http://localhost:8080/api/v1/user',
  //   'headers': {
  //     "Access-Control-Allow-Headers": "*",
  //     // 'User-Agent': 'PostmanRuntime/7.24.1',
  //     // 'Cache-Control': 'no-cache',
  //     // 'Postman-Token': '318a8aa1-94c5-4c8c-9274-3031fc380d1f',
  //     // 'Accept-Encoding': 'gzip, deflate, br',
  //     // 'Connection': 'keep-alive',
  //     'Content-Type': 'multipart/form-data',
  //     'Accept': 'application/json'
  //   },
  //   form:true,
  //   body: data
  // }
  // cy.request(options).then((response) => {
  //   if (error) throw new Error(error);
  //   console.log(response.body);
  // });

})








// -----------------------------------------------------------------------------------

Given(/^I send request for POST user without login$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': '',
      'email': email,
      'password': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
    cy.log(resp.body)
  })
})

Given(/^I send request for POST user without password$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': login,
      'email': email,
      'password': ''
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user without csr$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': login,
      'email': password,
      'password': password
      // TODO: ADD CSR.txt
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user without email$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': login,
      'email': '',
      'password': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    cy.log(resp)
    user = resp
  })
})

Given(/^I send a request for "POST" user twice$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': login,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: {
      'content-type': 'multipart/form-data',
      'accept': 'application/json'
    },
    form: true,
    body: {
      'login': login,
      'email': email,
      'password': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    expect(resp.status).to.eq(409)
    cy.log(resp)
    user = resp
  })
})

Given(/^I send request for POST user with login in field email$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': login,
      'email': login,
      'password': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    cy.log(resp)
    user = resp
  })
})

Given(/^I send request for POST user with email in field login$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': email,
      'email': email,
      'password': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    cy.log(resp)
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 2 uppercase letters$/, () => {
  let name = generate({
    length: 2,
    lowercase: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 2 lowercase letters$/, () => {
  let name = generate({
    length: 2,
    uppercase: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 20 uppercase letters$/, () => {
  let name = generate({
    length: 20,
    lowercase: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 20 lowercase letters$/, () => {
  let name = generate({
    length: 20,
    uppercase: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 3 uppercase letters$/, () => {
  let name = generate({
    length: 3,
    lowercase: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 3 lowercase letters$/, () => {
  let name = generate({
    length: 3,
    uppercase: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 19 uppercase letters$/, () => {
  let name = generate({
    length: 19,
    lowercase: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 19 lowercase letters$/, () => {
  let name = generate({
    length: 19,
    uppercase: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain only numbers$/, () => {
  let name = generate({
    numbers: true,
    uppercase: false,
    lowercase: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain letters in uppercase, lowercase and number$/, () => {
  let name = generate({
    numbers: true
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 2 words with uppercase and lowercase$/, () => {
  let name = generate({
    length: 5,
    symbols: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name + '  ' + name,
      'email': email,
      'password': password
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain only 1 letter$/, () => {
  let name = generate({
    length: 1,
    symbols: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 21 characters$/, () => {
  let name = generate({
    length: 21,
    symbols: false
  })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': name,
      'email': email,
      'password': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with username that contain only spaces$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': '               ',
      'email': email,
      'password': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with email that contain 2 @@$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': login,
      'email': login + '@@gmail.com',
      'password': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

// Given(/^I send request for POST user with email that not contain domain name$/, () => {
//   cy.request({
//     method: 'POST',
//     url: basic,
//     headers: headers,
//     form: true,
//     body: {
//       'login': login,
//       'email': login + '@gmail',
//       'password': password
//     },
//     failOnStatusCode: false
//   }).then((resp) => {
//     user = resp
//   })
// })

Given(/^I send request for POST user with password that contain 101 characters$/, () => {
  let passw = generate({
    length: 101,
    numbers: true,
    symbols: true,
  })
  cy.log(passw)
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': login,
      'email': email,
      'password': sha256(passw)
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with password that contain 100 characters$/, () => {
  let passw = generate({
    length: 100,
    numbers: true,
    symbols: true,
  })
  cy.log(passw)
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': login,
      'email': email,
      'password': sha256(passw)
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})



