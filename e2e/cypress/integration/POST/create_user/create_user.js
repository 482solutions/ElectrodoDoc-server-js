import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { generate } from 'generate-password'
import { getLogin, getPassword } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const basic = 'api/v1/user'

let user
let login
let email
let password
let csr

const headers = {
  'content-type': 'application/json'
}

beforeEach('Get user data', () => {
  login = getLogin()
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })
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

// -----------------------------------------------------------------------------------

Given(/^I send request for "POST" user$/, async () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
    cy.log(resp.body)
  })
})

Given(/^I send request for POST user without login$/, () => {
  let login = ''
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
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
    body: {
      'login': login,
      'email': email,
      'password': '',
      'CSR': csr.csrPem
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
    body: {
      'login': login,
      'email': password,
      'password': password,
      'CSR': ''
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
    body: {
      'login': login,
      'email': '',
      'password': password,
      'CSR': csr.csrPem
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
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
  }).request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    cy.log(resp)
    user = resp
  })
})

Given(/^I send request for POST user with login in field email$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': login,
      'password': password,
      'CSR': csr.csrPem
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
    body: {
      'login': email,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    cy.log(resp)
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 2 uppercase letters$/, () => {
  let login = generate({
    length: 2,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 2 lowercase letters$/, () => {
  let login = generate({
    length: 2,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 20 uppercase letters$/, () => {
  let login = generate({
    length: 20,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 20 lowercase letters$/, () => {
  let login = generate({
    length: 20,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 3 uppercase letters$/, () => {
  let login = generate({
    length: 3,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 3 lowercase letters$/, () => {
  let login = generate({
    length: 3,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 19 uppercase letters$/, () => {
  let login = generate({
    length: 19,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 19 lowercase letters$/, () => {
  let login = generate({
    length: 19,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain only numbers$/, () => {
  let login = generate({
    numbers: true,
    uppercase: false,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain letters in uppercase, lowercase and number$/, () => {
  let login = generate({
    numbers: true
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 2 words with uppercase and lowercase$/, () => {
  let login = generate({
    length: 5,
    symbols: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login + '  ' + login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with username that contain only 1 letter$/, () => {
  let login = generate({
    length: 1,
    symbols: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 21 characters$/, () => {
  let login = generate({
    length: 21,
    symbols: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with username that contain only spaces$/, () => {
  let login = '            '
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
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
    body: {
      'login': login,
      'email': login + '@@gmail.com',
      'password': password,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

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
    body: {
      'login': login,
      'email': email,
      'password': passw,
      'CSR': csr.csrPem
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
    body: {
      'login': login,
      'email': email,
      'password': passw,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})



