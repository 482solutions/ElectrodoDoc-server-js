import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { sha256 } from 'js-sha256'
import { getCSR } from '../../../support/csr'

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
})

When(/^I got response status 200 in update$/, () => {
  expect(200).to.eq(user.status)
})

When(/^I got response status 201 in update$/, () => {
  expect(201).to.eq(user.status)
})

When(/^I got response status 203 in update$/, () => {
  expect(203).to.eq(user.status)
})

Then(/^I got response status 422 in update$/, () => {
  expect(422).to.eq(user.status)
});

Given(/^I send request for create new user and getting JWT token$/, () => {
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
  cy.wait(2000)

})

Then(/^I send request for getting JWT token$/, () => {
  privateKey = cy.readFile('cypress/fixtures/privateKey.pem').then((text) => {
    expect(text).to.include('-----BEGIN PRIVATE KEY-----')
    expect(text).to.include('-----END PRIVATE KEY-----')
  })

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
  cy.wait(2000)
});

Given(/^I send request for update password$/, () => {
  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'PUT',
    url: basic,
    headers: headers,
    body: {
      'oldPassword': password,
      'newPassword': sha256('Albert123457')
    }
  }).then((resp) => {
    user = resp
    cy.log(user)
  })
})

Given(/^I send request for update password without auth$/, () => {
  headers.Authorization = 'Bearer '
  cy.request({
    method: 'PUT',
    url: basic,
    headers: headers,
    body: {
      'oldPassword': password,
      'newPassword': sha256('Albert123457')
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
    cy.log(user)
  })
});

Given(/^I send request for update password to empty new password$/, () => {
  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'PUT',
    url: basic,
    headers: headers,
    body: {
      'oldPassword': '',
      'newPassword': sha256('Albert123457')
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
    cy.log(user)
  })
});

Given(/^I send request for update password update request with the same data$/, () => {
  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'PUT',
    url: basic,
    headers: headers,
    body: {
      'oldPassword': password,
      'newPassword': password
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
    cy.log(user)
  })
});
Given(/^I send request for update password without old password$/, () => {
  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'PUT',
    url: basic,
    headers: headers,
    body: {
      'oldPassword': password,
      'newPassword': ''
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
    cy.log(user)
  })
});
