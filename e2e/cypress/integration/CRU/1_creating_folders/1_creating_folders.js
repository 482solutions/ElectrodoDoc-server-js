import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'
import { sha256 } from 'js-sha256'

const basic = 'api/v1'
const headers = {
  'content-type': 'application/json'
}

let user, token, login, email, password, csr, parentFolder

before(() => {
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

/*
  Expect response status:
 */

When(/^Response status 200$/, () => {
  expect(200).to.eq(user.status)
})

When(/^Response status 201$/, () => {
  expect(201).to.eq(user.status)
})

Then(/^Response status 203$/, () => {
  expect(203).to.eq(user.status)
})

Then(/^Response status 409$/, () => {
  expect(409).to.eq(user.status)
})

Then(/^Response status 422$/, () => {
  expect(422).to.eq(user.status)
})

/*
  Implementation of the steps from **.feature
 */

Given(/^Send request for create user and get token$/, () => {
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: `${basic}/user`,
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
      cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert)
        .then(() => {
          cy.readFile('cypress/fixtures/cert.pem').then((text) => {
            expect(text).to.include('-----BEGIN CERTIFICATE-----')
            expect(text).to.include('-----END CERTIFICATE-----')
          })
        })
    })
  }).fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: `${basic}/user/auth`,
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': cert,
          'privateKey': key,
        },
      }).then((resp) => {
        token = resp.body.token
        user = resp
        parentFolder = resp.body.folder
      })
    })
  })
})

Given(/^User send request for create folder in root folder with name (.*) from list$/, (foldersName) => {
  headers.Authorization = `Bearer ${token}`
  cy.request({
    method: 'POST',
    url: basic + '/folder',
    headers: headers,
    body: {
      'name': foldersName,
      'parentFolder': parentFolder
    },
  }).then((resp) => {
    user = resp
  })
})

Given(/^User send request for create folder in user's folder with name "([^"]*)"$/, (name) => {
  let folders = JSON.parse(user.body.folder.folders)
  for (let key in folders) {
    if (name === folders[key].name) {
      let folder = folders[key].hash
      if (folder !== undefined) {
        headers.Authorization = `Bearer ${token}`
        cy.request({
          method: 'POST',
          url: basic + '/folder',
          headers: headers,
          body: {
            'name': name,
            'parentFolder': folder
          },
        }).then((resp) => {
          user = resp
        })
      }
    }
  }
})

Given(/^User send request for create folder in root folder without name$/, () => {
  headers.Authorization = `Bearer ${token}`
  cy.request({
    method: 'POST',
    url: basic + '/folder',
    headers: headers,
    body: {
      'name': '',
      'parentFolder': sha256(login)
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^User send request for create folder in root folder with name (.*) from list than 64 characters and more$/, (bigName) => {
  headers.Authorization = `Bearer ${token}`
  cy.request({
    method: 'POST',
    url: basic + '/folder',
    headers: headers,
    body: {
      'name': bigName,
      'parentFolder': sha256(login)
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^User send request for create folder in root folder with existing name (.*) from list$/, (existingName) => {
  headers.Authorization = `Bearer ${token}`
  cy.request({
    method: 'POST',
    url: basic + '/folder',
    headers: headers,
    body: {
      'name': existingName,
      'parentFolder': sha256(login)
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^User send request for create folder with spaces in folders name$/, function () {
  headers.Authorization = `Bearer ${token}`
  cy.request({
    method: 'POST',
    url: basic + '/folder',
    headers: headers,
    body: {
      'name': '     ',
      'parentFolder': sha256(login)
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^User send request for create folder without auth$/, function () {
  headers.Authorization = 'Bearer '
  cy.request({
    method: 'POST',
    url: basic + '/folder',
    headers: headers,
    body: {
      'name': 'qwerty',
      'parentFolder': sha256(login)
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})
