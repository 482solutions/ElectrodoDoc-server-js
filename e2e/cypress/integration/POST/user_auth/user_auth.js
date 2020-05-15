import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { decode, getLogin, getPassword } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const jwt = require('jsonwebtoken');

const basic = 'api/v1/user'

const headers = {
  'content-type': 'application/json'
}

let user
let token
let login
let email
let password
let cert
let csr
let privateKey

before('Get user data', () => {
  login = getLogin() + 'JWT'
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })
  privateKey = cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
    .readFile('cypress/fixtures/privateKey.pem')
    .then((text) => {
    expect(text).to.include('-----BEGIN PRIVATE KEY-----')
    expect(text).to.include('-----END PRIVATE KEY-----')
  })
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

//-----------------------------------------------------------------------------

Given(/^I sending a request for create new user$/, () => {
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
    user = resp
    cert = cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert)
      .then(() => {
        cert = cy.readFile('cypress/fixtures/cert.pem').then((text) => {
          expect(text).to.include('-----BEGIN CERTIFICATE-----')
          expect(text).to.include('-----END CERTIFICATE-----')
        })
      })
  })
})

Given(/^I send request for getting JWT token with username$/, () => {
  cy.fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((privateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': cert,
          'privateKey': privateKey,
        },
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
})

Then(/^Response body contains valid JWT token$/, () => {
  let header = decode(token, 0)
  expect('HS256').to.equal(header.alg)
  expect('JWT').to.equal(header.typ)

  let payload = decode(token, 1)
  expect(login).to.equal(payload.data)

  let verify = jwt.decode(token, { complete: true })
  expect(token.split('.')[2]).to.equal(verify.signature)
})

Given(/^I send request for getting JWT token with email$/, () => {
  cy.fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((privateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': email,
          'password': password,
          'certificate': cert,
          'privateKey': privateKey,
        },
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
})

Given(/^I send request for getting JWT token with incorrect password$/, () => {
  cy.fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((privateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': email,
          'password': 'invalidPassword',
          'certificate': cert,
          'privateKey': privateKey,
        },
        failOnStatusCode: false
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
})

Given(/^I send request for getting JWT token with incorrect username$/, () => {
  cy.fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((privateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': 'invalidUsername',
          'password': password,
          'certificate': cert,
          'privateKey': privateKey,
        },
        failOnStatusCode: false
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
})

Given(/^I send request for getting JWT token with incorrect username and incorrect password$/, () => {
  cy.fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((privateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': 'invalidUsername',
          'password': 'invalidPassword',
          'certificate': cert,
          'privateKey': privateKey,
        },
        failOnStatusCode: false
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
})

Given(/^I send request for getting JWT token without username$/, () => {
  cy.fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((privateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': '',
          'password': password,
          'certificate': cert,
          'privateKey': privateKey,
        },
        failOnStatusCode: false
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
})

Given(/^I send request for getting JWT token with incorrect cert$/, () => {
  cy.fixture('invalidCert.pem').then((invalidCert) => {
    cy.fixture('privateKey.pem').then((privateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': invalidCert,
          'privateKey': privateKey,
        },
        failOnStatusCode: false
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
});

Given(/^I send request for getting JWT token with incorrect privateKey$/, () => {
  cy.fixture('cert.pem').then((cert) => {
    cy.fixture('invalidPrivateKey.pem').then((invalidPrivateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': cert,
          'privateKey': invalidPrivateKey,
        },
        failOnStatusCode: false
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
})

Given(/^I send request for getting JWT token with incorrect cert and incorrect privateKey$/, () => {
  cy.fixture('invalidCert.pem').then((invalidCert) => {
    cy.fixture('invalidPrivateKey.pem').then((invalidPrivateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': invalidCert,
          'privateKey': invalidPrivateKey,
        },
        failOnStatusCode: false
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
})
