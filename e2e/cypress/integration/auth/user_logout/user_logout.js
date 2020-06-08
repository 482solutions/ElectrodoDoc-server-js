import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const basic = 'api/v1/user'

const headers = {
  'content-type': 'application/json'
}

let user, token, login, email, password, csr

beforeEach(() => {
  login = getLogin() + 'JWT'
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })

  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
    .readFile('cypress/fixtures/privateKey.pem')
    .then((text) => {
      expect(text).to.include('-----BEGIN PRIVATE KEY-----')
      expect(text).to.include('-----END PRIVATE KEY-----')
    })
})

When(/^I got response status 200 out$/, () => {
  expect(200).to.eq(user.status)
})

Then(/^I got response status 203 out$/, () => {
  expect(203).to.eq(user.status)
});

Given(/^I send request for create user and get token$/, () => {
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: basic,
      headers: headers,
      body: {
        'login': login,
        'email': email,
        'password': password,
        'privateKey': key,
        'CSR': csr.csrPem,
      },
    }).then((resp) => {
      user = resp
      cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert)
        .then(() => {
          cy.readFile('cypress/fixtures/cert.pem').then((text) => {
            expect(text).to.include('-----BEGIN CERTIFICATE-----')
            expect(text).to.include('-----END CERTIFICATE-----')
          })
        })
    })
  })

  cy.readFile('cypress/fixtures/cert.pem').then((certificate) => {
    cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': certificate,
          'privateKey': key,
        },
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
})

Given(/^I send request for logout$/, () => {
  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'DELETE',
    url: basic + '/logout',
    headers: headers
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for logout without token$/, () => {
  cy.request({
    method: 'DELETE',
    url: basic + '/logout',
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for logout with incorrect token$/,  () => {
  headers.Authorization = 'Bearer incorrectToken'
  cy.request({
    method: 'DELETE',
    url: basic + '/logout',
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})
