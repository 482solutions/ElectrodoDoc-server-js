import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { decode, getLogin, getPassword } from '../../../support/commands'

const basic = 'api/v1/user'

const headers = {
  'content-type': 'multipart/form-data',
  'accept': 'application/json'
}

let user_id
let user
let token
let login
let email
let password

before('Get user data', () => {
  login = getLogin()
  password = getPassword()
  email = login + '@gmail.com'
})

When(/^I got response status 200$/, () => {
  expect(200).to.eq(user.status)
})

When(/^I got response status 201$/, () => {
  expect(201).to.eq(user.status)
})

When(/^I got response status 400$/, () => {
  expect(400).to.eq(user.status)
})

When(/^I got response status 403$/, () => {
  expect(403).to.eq(user.status)
})

When(/^I got response status 404$/, () => {
  expect(404).to.eq(user.status)
})

When(/^I got response status 422$/, () => {
  expect(422).to.eq(user.status)
})

Given(/^I send request for create new user$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    form: true,
    body: {
      'login': login,
      'email': email,
      'password': password,
      // TODO add CSR to all steps
      // 'CSR': csr,
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
    user_id = resp.body
  })
})

Given(/^I send request for getting JWT token with username$/, () => {
  cy.request({
    method: 'POST',
    url: basic + '/auth',
    headers: headers,
    form: true,
    body: {
      'login': login,
      'password': password,
      'certificate': cy.fixture('mockCert.pem'),
      'private key': cy.fixture('mockPrivateKey.pem'),
    },
  }).then((resp) => {
    user = resp
    token = resp.body
    cy.log(token.toString())
  })
})

Then(/^Response body contains JWT token$/, function () {
  let header = decode(token, 0)
  expect('HS256').to.equal(header.alg)
  expect('JWT').to.equal(header.typ)

  let payload = decode(token, 1)
  expect(true).to.eq(payload.authorized)
  //TODO:
  // expect(user_id).to.eq(payload.user_id)
})

Given(/^I send request for getting JWT token with email$/, () => {
  cy.request({
    method: 'POST',
    url: basic + '/auth',
    headers: headers,
    form: true,
    body: {
      'login': email,
      'password': password,
      'certificate': cy.fixture('mockCert.pem'),
      'private key': cy.fixture('mockPrivateKey.pem'),
    },
  }).then((resp) => {
    user = resp
    token = resp.body
  })
})

Given(/^I send request for getting JWT token with incorrect password$/, () => {
  cy.request({
    method: 'POST',
    url: basic + '/auth',
    headers: headers,
    form: true,
    body: {
      'login': login,
      'password': 'incorrectPassword',
      'certificate': cy.fixture('mockCert.pem'),
      'private key': cy.fixture('mockPrivateKey.pem'),
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

// TODO: user authorization for change password
// cy.request({
//   method: 'PUT',
//   url: basic,
//   authorized: {
//     bearer: user,
//     headers: { 'accept': 'application/json' },
//     form: true,
//     body: {
//       'oldPassword': 'Mock12345',
//       'newPassword': '12345Mock',
//     },
//   },
// }).then((resp) => {
//   cy.log(resp)
// })
Given(/^I send request for getting JWT token with incorrect username$/, () => {
  cy.request({
    method: 'POST',
    url: basic + '/auth',
    headers: headers,
    form: true,
    body: {
      'login': 'incorrectUsername',
      'password': password,
      'certificate': cy.fixture('mockCert.pem'),
      'private key': cy.fixture('mockPrivateKey.pem'),
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for getting JWT token with incorrect username and incorrect password$/, () => {
  cy.request({
    method: 'POST',
    url: basic + '/auth',
    headers: headers,
    form: true,
    body: {
      'login': 'incorrectUsername',
      'password': 'incorrectPassword',
      'certificate': cy.fixture('mockCert.pem'),
      'private key': cy.fixture('mockPrivateKey.pem'),
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for getting JWT token without username$/, () => {
  cy.request({
    method: 'POST',
    url: basic + '/auth',
    headers: headers,
    form: true,
    body: {
      'login': '',
      'password': password,
      'certificate': cy.fixture('mockCert.pem'),
      'private key': cy.fixture('mockPrivateKey.pem'),
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})
