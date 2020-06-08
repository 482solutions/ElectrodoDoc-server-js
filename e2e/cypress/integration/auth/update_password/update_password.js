import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { sha256 } from 'js-sha256'
import { getCSR } from '../../../support/csr'

const basic = 'api/v1/user'

const headers = {
  'content-type': 'application/json'
}

let user, token, login, email, password, csr

before('Get user data', () => {
  login = getLogin() + 'auth'
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
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      user = resp
      console.log(resp.body)
      cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert)
        .then(() => {
          cy.readFile('cypress/fixtures/cert.pem').then((text) => {
            expect(text).to.include('-----BEGIN CERTIFICATE-----')
            expect(text).to.include('-----END CERTIFICATE-----')
          })
        })
    })
  })
})

Then(/^I send request for getting JWT token$/, () => {
  cy.readFile('cypress/fixtures/cert.pem').then((cert) => {
    cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: basic + '/auth',
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': cert,
          'privateKey': key,
        },
      }).then((resp) => {
        user = resp
        token = resp.body.token
      })
    })
  })
})

Given(/^I send request for update password$/, () => {
  headers.Authorization = `Bearer ${token}`
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
    console.log(resp.body)
  })
})

Given(/^I send request for update password without Bearer$/, () => {
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
    // user = resp
    console.log(resp.body)
  })
});

Given(/^I send request for update password to empty new password$/, () => {
  headers.Authorization = `Bearer ${token}`
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
    console.log(resp.body)
  })
});

Given(/^I send request for update password update request with the same data$/, () => {
  headers.Authorization = `Bearer ${token}`
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
    console.log(resp.body)
  })
});
Given(/^I send request for update password without old password$/, () => {
  headers.Authorization = `Bearer ${token}`
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
    console.log(resp.body)
  })
});
