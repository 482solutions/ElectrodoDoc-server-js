import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { generate } from 'generate-password'
import { getLogin, getPassword } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const headers = {
  'content-type': 'application/json'
}

beforeEach('Get user data', () => {
  Cypress.env('login', getLogin())
  Cypress.env('password', getPassword())
  Cypress.env('email', getLogin() + '@gmail.com')
})

Given(/^I send request for POST user without login$/, () => {
  let csr = getCSR({ username: '' })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': '',
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user without password$/, () => {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('login'),
        'email': Cypress.env('email'),
        'password': '',
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user without csr$/, () => {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
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
        'CSR': ''
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user without email$/, () => {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('login'),
        'email': '',
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send a request for "POST" user twice$/, () => {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
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
      expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
      expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    }).request({
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
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(409).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with login in field email$/, () => {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('login'),
        'email': Cypress.env('login'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with email in field login$/, () => {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('email'),
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain 2 uppercase letters$/, () => {
  let login = generate({
    length: 2,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})
Given(/^I send request for POST user with username that contain 2 lowercase letters$/, () => {
  let login = generate({
    length: 2,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain 20 uppercase letters$/, () => {
  let login = generate({
    length: 20,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain 20 lowercase letters$/, () => {
  let login = generate({
    length: 20,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain 3 uppercase letters$/, () => {
  let login = generate({
    length: 3,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain 3 lowercase letters$/, () => {
  let login = generate({
    length: 3,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain 19 uppercase letters$/, () => {
  let login = generate({
    length: 19,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain 19 lowercase letters$/, () => {
  let login = generate({
    length: 19,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain only numbers$/, () => {
  let login = generate({
    numbers: true,
    uppercase: false,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain letters in uppercase, lowercase and number$/, () => {
  let login = generate({
    numbers: true
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      if (expect(201).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain 2 words with uppercase and lowercase$/, () => {
  let login = generate({
    length: 5,
    symbols: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login + '  ' + login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain only 1 letter$/, () => {
  let login = generate({
    length: 1,
    symbols: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain 21 characters$/, () => {
  let login = generate({
    length: 21,
    symbols: false
  })
  let csr = getCSR({ username: login })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': login,
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with username that contain only spaces$/, () => {
  let csr = getCSR({ username: '            ' })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': '            ',
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with email that contain 2 @@$/, () => {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('login'),
        'email': `${Cypress.env('login')}@@g.com`,
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with password that contain 101 characters$/, () => {
  let password = generate({
    length: 101,
    numbers: true,
    symbols: true,
  })
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('login'),
        'email': Cypress.env('email'),
        'password': password,
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user with password that contain 100 characters$/, () => {
  let password = generate({
    length: 100,
    numbers: true,
    symbols: true,
  })
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('login'),
        'email': Cypress.env('email'),
        'password': password,
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user without field password$/, function () {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('login'),
        'email': Cypress.env('email'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user without field email$/, function () {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'login': Cypress.env('login'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})

Given(/^I send request for POST user without field login$/, function () {
  let csr = getCSR({ username: Cypress.env('login') })
  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: '/user',
      headers: headers,
      body: {
        'email': Cypress.env('email'),
        'password': Cypress.env('password'),
        'privateKey': key,
        'CSR': csr.csrPem
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (expect(422).to.eq(resp.status)) {
        Cypress.env('respStatus', resp.status)
      }
    })
  })
})
