import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { decode} from '../../../support/commands'
import { sha256 } from 'js-sha256'

const jwt = require('jsonwebtoken')
const headers = {
  'content-type': 'application/json'
}

Given(/^I send request for getting JWT token with username$/, async () => {
  cy.readFile('cypress/fixtures/cert.pem').then((cert) => {
    cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: '/user/auth',
        headers: headers,
        body: {
          'login': Cypress.env('login'),
          'password': Cypress.env('password'),
          'certificate': cert,
          'privateKey': key,
        },
      }).then((resp) => {
        if (expect(200).to.eq(resp.status)) {
          Cypress.env('token', resp.body.token)
          Cypress.env('respStatus', resp.status)
          Cypress.env('rootFolder', resp.body.folder)
        }
      })
    })
  })
  cy.wait(2000)
})

Then(/^Response body contains valid JWT token$/, () => {
  let token = Cypress.env('token')
  cy.wait(2000)
  let header = decode(token, 0)
  expect('HS256').to.equal(header.alg)
  expect('JWT').to.equal(header.typ)

  let payload = decode(token, 1)
  expect(Cypress.env('login')).to.equal(payload.data)

  let verify = jwt.decode(token, { complete: true })
  expect(token.split('.')[2]).to.equal(verify.signature)
})

Given(/^I send request for getting JWT token with email$/, () => {
  cy.readFile('cypress/fixtures/cert.pem').then((cert) => {
    cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: '/user/auth',
        headers: headers,
        body: {
          'login': Cypress.env('email'),
          'password': Cypress.env('password'),
          'certificate': cert,
          'privateKey': key,
        },
      }).then((resp) => {
        if (expect(200).to.eq(resp.status)) {
          Cypress.env('token', resp.body.token)
          Cypress.env('respStatus', resp.status)
          Cypress.env('rootFolder', resp.body.folder)
        }
      })
    })
  })
  cy.wait(2000)
})

Given(/^I send request for getting JWT token with incorrect password$/, () => {
  cy.readFile('cypress/fixtures/cert.pem').then((cert) => {
    cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: '/user/auth',
        headers: headers,
        body: {
          'login': Cypress.env('login'),
          'password': sha256('invalidPassword'),
          'certificate': cert,
          'privateKey': key,
        },
        failOnStatusCode: false
      }).then((resp) => {
        if (expect(400).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
    })
  })
  cy.wait(2000)
})

Given(/^I send request for getting JWT token with incorrect username$/, () => {
  cy.readFile('cypress/fixtures/cert.pem').then((cert) => {
    cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: '/user/auth',
        headers: headers,
        body: {
          'login': 'incorrectUsername',
          'password': Cypress.env('password'),
          'certificate': cert,
          'privateKey': key,
        },
        failOnStatusCode: false
      }).then((resp) => {
        if (expect(404).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
    })
  })
  cy.wait(2000)
})

Given(/^I send request for getting JWT token with incorrect username and incorrect password$/, () => {
  cy.readFile('cypress/fixtures/cert.pem').then((cert) => {
    cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: '/user/auth',
        headers: headers,
        body: {
          'login': 'incorrectUsername',
          'password': sha256('invalidPassword'),
          'certificate': cert,
          'privateKey': key,
        },
        failOnStatusCode: false
      }).then((resp) => {
        if (expect(404).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
    })
  })
  cy.wait(2000)
})

Given(/^I send request for getting JWT token without username$/, () => {
  cy.readFile('cypress/fixtures/cert.pem').then((cert) => {
    cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: '/user/auth',
        headers: headers,
        body: {
          'login': '',
          'password': Cypress.env('password'),
          'certificate': cert,
          'privateKey': key,
        },
        failOnStatusCode: false
      }).then((resp) => {
        if (expect(422).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
    })
  })
  cy.wait(2000)
})

Given(/^I send request for getting JWT token with incorrect cert$/, () => {
  cy.readFile('cypress/fixtures/invalidCert.pem').then((invalidCert) => {
    cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: '/user/auth',
        headers: headers,
        body: {
          'login': Cypress.env('login'),
          'password': Cypress.env('password'),
          'certificate': invalidCert,
          'privateKey': key,
        },
        failOnStatusCode: false
      }).then((resp) => {
        if (expect(403).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
    })
  })
  cy.wait(2000)
})

Given(/^I send request for getting JWT token with incorrect privateKey$/, () => {
  cy.readFile('cypress/fixtures/cert.pem').then((cert) => {
    cy.readFile('cypress/fixtures/invalidPrivateKey.pem').then((invalidPrivateKey) => {
      cy.request({
        method: 'POST',
        url: '/user/auth',
        headers: headers,
        body: {
          'login': Cypress.env('login'),
          'password': Cypress.env('password'),
          'certificate': cert,
          'privateKey': invalidPrivateKey,
        },
        failOnStatusCode: false
      }).then((resp) => {
        if (expect(403).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
    })
  })
  cy.wait(2000)
})

Given(/^I send request for getting JWT token with incorrect cert and incorrect privateKey$/, () => {
  cy.readFile('cypress/fixtures/invalidCert.pem').then((invalidCert) => {
    cy.readFile('cypress/fixtures/invalidPrivateKey.pem').then((invalidPrivateKey) => {
      cy.request({
        method: 'POST',
        url: '/user/auth',
        headers: headers,
        body: {
          'login': Cypress.env('login'),
          'password': Cypress.env('password'),
          'certificate': invalidCert,
          'privateKey': invalidPrivateKey,
        },
        failOnStatusCode: false
      }).then((resp) => {
        if (expect(403).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
    })
  })
  cy.wait(2000)
})
