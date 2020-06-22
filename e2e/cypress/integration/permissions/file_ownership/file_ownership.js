import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}
Given(/^User sends request to transfer file ownership to user2$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = Cypress.env('filesInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': 'owner'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(Cypress.env('login_2')).to.equal(resp.body.response.ownerId)
    /*
    Previous owner has read and edit permissions:
     */
    expect(Cypress.env('login')).to.equal(resp.body.response.readUsers[0])
    expect(Cypress.env('login')).to.equal(resp.body.response.writeUsers[0])
  }).wait(2000)
})

When(/^User2 can back to user1 file ownership$/,  () => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const file = Cypress.env('filesInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email'),
      'hash': file,
      'permission': 'owner'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(Cypress.env('login')).to.equal(resp.body.response.ownerId)
    /*
    The first owner has read and edit permissions:
     */
    expect(Cypress.env('login')).to.equal(resp.body.response.readUsers[0])
    expect(Cypress.env('login')).to.equal(resp.body.response.writeUsers[0])
    /*
    End the second owner has permissions to read and edit file:
     */
    expect(Cypress.env('login_2')).to.equal(resp.body.response.readUsers[1])
    expect(Cypress.env('login_2')).to.equal(resp.body.response.writeUsers[1])
  }).wait(2000)
})

Given(/^User sends request to transfer file ownership to user3$/, function () {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const file = Cypress.env('filesInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_3'),
      'hash': file,
      'permission': 'owner'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(Cypress.env('login_3')).to.equal(resp.body.response.ownerId)
    /*
    Previous owner has read and edit permissions:
     */
    // expect(Cypress.env('login')).to.equal(resp.body.response.readUsers[0])
    // expect(Cypress.env('login')).to.equal(resp.body.response.writeUsers[0])
  }).wait(2000)
})

Then(/^Verify that the user1 has a file "([^"]*)"$/,  (filename) => {
  const files = Cypress.env('filesInRoot')
  expect(files.length).to.equal(1)
  let cid = null
  let hash = getHashFromFile('mockTest.txt', files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`

  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      expect(resp.body.name).to.equal('mockTest.txt')
      expect(resp.body.file).to.equal('Hello, world!')
      Cypress.env('respStatus', resp.status)
    }
  })
})

Then(/^Verify that the user2 has a file "([^"]*)"$/, (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const files = Cypress.env('filesInRoot')
  expect(files.length).to.equal(1)
  let cid = null
  let hash = getHashFromFile('mockTest.txt', files)

  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      expect(resp.body.name).to.equal('mockTest.txt')
      expect(resp.body.file).to.equal('Hello, world!')
      Cypress.env('respStatus', resp.status)
    }
  })
})

Then(/^Verify that the user3 has a file "([^"]*)"$/,  (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token_3')}`

  const files = Cypress.env('filesInRoot')
  expect(files.length).to.equal(1)
  let cid = null
  let hash = getHashFromFile('mockTest.txt', files)

  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      expect(resp.body.name).to.equal('mockTest.txt')
      expect(resp.body.file).to.equal('Hello, world!')
      Cypress.env('respStatus', resp.status)
    }
  })
})

Given(/^User sends a request to transfer file ownership to nonexistent user$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = Cypress.env('filesInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': 'nonexist@gmail.com',
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer of rights to a nonexistent file$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const hakeFile = 'jsefklefjiewfbhvskjdu4h34h3cj3jhcbhjvj4csfadsfutsie352353mvsdr43'
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': hakeFile,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer file ownership with Empty Bearer$/, () => {
  headers.Authorization = `Bearer `
  const file = Cypress.env('filesInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect('Not Authorized').to.equal(resp.body.message)
    console.log(resp)
  }).wait(2000)
})

Given(/^User sends a request to transfer file ownership without Bearer$/, () => {
  const file = Cypress.env('filesInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect('Not Authorized').to.equal(resp.body.message)
  }).wait(2000)
})

Given(/^User sends a request to transfer file ownership with incorrect permission (.*)$/, (incPermission) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = Cypress.env('filesInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': incPermission
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer file ownership with empty email$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = Cypress.env('filesInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': '',
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer file ownership with empty hash$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': '',
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer file ownership with empty permission$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = Cypress.env('filesInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': ''
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})
