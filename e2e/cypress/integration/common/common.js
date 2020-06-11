import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getCSR } from '../../support/csr'
import { getLogin, getPassword } from '../../support/commands'

When(/^Response status 200$/, () => {
  expect(200).to.equal(Cypress.env('respStatus'))
})

When(/^Response status 201$/, () => {
  expect(201).to.equal(Cypress.env('respStatus'))
})

Then(/^Response status 203$/, () => {
  expect(203).to.equal(Cypress.env('respStatus'))
})

Then(/^Response status 400$/, () => {
  expect(400).to.equal(Cypress.env('respStatus'))
})

Then(/^Response status 403$/, () => {
  expect(403).to.equal(Cypress.env('respStatus'))
})

Then(/^Response status 404$/, () => {
  expect(404).to.equal(Cypress.env('respStatus'))
})

Then(/^Response status 409$/, () => {
  expect(409).to.equal(Cypress.env('respStatus'))
})

Then(/^Response status 422$/, () => {
  expect(422).to.equal(Cypress.env('respStatus'))
})

Given(/^I send request for create user$/, () => {

  Cypress.env('login', getLogin())
  Cypress.env('password', getPassword())
  Cypress.env('email', getLogin() + '@gmail.com')

  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
    .readFile('cypress/fixtures/privateKey.pem')
    .then((text) => {
      expect(text).to.include('-----BEGIN PRIVATE KEY-----')
      expect(text).to.include('-----END PRIVATE KEY-----')
    })
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: {
        'content-type': 'application/json'
      },
      body: {
        'login': Cypress.env('login'),
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
        cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert).then(() => {
          cy.readFile('cypress/fixtures/cert.pem').then((text) => {
            expect(text).to.include('-----BEGIN CERTIFICATE-----')
            expect(text).to.include('-----END CERTIFICATE-----')
          })
        })
      }
    })
  })
})

Given(/^Send request for create user and get token$/, () => {

  Cypress.env('login', getLogin())
  Cypress.env('password', getPassword())
  Cypress.env('email', getLogin() + '@gmail.com')

  const headers = {
    'content-type': 'application/json'
  }
  let csr =  getCSR({ username: Cypress.env('login') })

  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
    .readFile('cypress/fixtures/privateKey.pem')
    .then((text) => {
      expect(text).to.include('-----BEGIN PRIVATE KEY-----')
      expect(text).to.include('-----END PRIVATE KEY-----')
    })
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('login'),
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      Cypress.env('respStatus', resp.status)
      cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert)
        .then(() => {
          cy.readFile('cypress/fixtures/cert.pem').then((text) => {
            expect(text).to.include('-----BEGIN CERTIFICATE-----')
            expect(text).to.include('-----END CERTIFICATE-----')
          })
        })
    })
  }).readFile('cypress/fixtures/cert.pem').then((cert) => {
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
  }).wait(6000)
})