import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

When(/^The user1 sends a request to grant edit access to the file "([^"]*)" to user1$/, (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email'),
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

When(/^The user2 sends a request to grant edit access to the file "([^"]*)" to user2$/, (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

Given(/^The user1 sends a request to grant edit access to the file "([^"]*)" to user2$/,  (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

Then(/^User 1 is the owner of the file$/, () => {
  expect(Cypress.env('login')).to.equal(Cypress.env('respBody').response.ownerId)
});

When(/^The user2 sends a request to grant edit access to the file "([^"]*)" to user3$/, (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_3'),
      'hash': fileHash,
      'permission': 'write'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

When(/^The user1 sends a request to grant edit access to the file "([^"]*)" to user2 and user3$/,  (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': `${Cypress.env('email_2')}, ${Cypress.env('email_3')}`,
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

Then(/^Verify that the user2 has the editor rights for "([^"]*)" file$/,  (file) => {
  expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_2'))).to.be.true
  expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_2'))).to.be.true

  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  expect(Cypress.env('filesInRoot').length).to.equal(1)

  let cid = null
  let hash = getHashFromFile(file, Cypress.env('filesInRoot'))

  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      expect(resp.body.name).to.equal(file)
      expect(resp.body.file).to.equal('Hello, world!')
      Cypress.env('respStatus', resp.status)
    }
  })
});

Then(/^Verify that the user3 has the editor rights for "([^"]*)" file$/,  (file) => {
  expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_3'))).to.be.true
  expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_3'))).to.be.true

  headers.Authorization = `Bearer ${Cypress.env('token_3')}`
  expect(Cypress.env('filesInRoot').length).to.equal(1)
  let cid = null
  let hash = getHashFromFile(file, Cypress.env('filesInRoot'))

  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      expect(resp.body.name).to.equal(file)
      expect(resp.body.file).to.equal('Hello, world!')
      Cypress.env('respStatus', resp.status)
    }
  })
});

Given(/^The user1 sends a request to grant edit access to the file "([^"]*)" to user with email "([^"]*)"$/,  (filename, incorrectEmail) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': incorrectEmail,
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)

  })
});

Then(/^Message "([^"]*)"$/, (text) => {
  expect(text).to.equal(Cypress.env('respBody').message)
});

When(/^The user1 sends a request to grant edit access to the file "([^"]*)" with empty email$/, (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': '',
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
When(/^The user1 sends a request to grant edit access to the file "([^"]*)" with spaces in email$/, (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': '          ',
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

When(/^The user1 sends a request to grant edit access to the file "([^"]*)" with username in email$/,  (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('login_2'),
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
Then(/^User2 as Editor send request for transfer ownership to user3$/, (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_3'),
      'hash': fileHash,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
