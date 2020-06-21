import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

const headers = {
  'content-type': 'application/json'
}

Given(/^User sends request to transfer folder ownership to "([^"]*)"$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
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

Then(/^Verify that the user has a folder "([^"]*)"$/, (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'GET',
    url: `/folder/${folder}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(filename).to.equal(resp.body.folder.folderName)
  })
})

Given(/^User sends a request to transfer folder ownership to nonexistent user$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': 'nonexist@gmail.com',
      'hash': folder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer of rights to a nonexistent folder$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const hakeFolder = 'jsefklefjiewfbhvskjdu4h34h3cj3jhcbhjvj4csfadsfutsie352353mvsdr43'
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': hakeFolder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer of incorrect rights OWNER$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
      'permission': 'OWNER'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership with Empty Bearer$/, () => {
  headers.Authorization = `Bearer `
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': 'nonexist@gmail.com',
      'hash': folder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership without Bearer$/, () => {
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership with incorrect permission (.*)$/, (incPermission) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
      'permission': incPermission
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership with empty email$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': '',
      'hash': folder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership with empty hash$/, () => {
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

Given(/^User sends a request to transfer folder ownership with empty permission$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
      'permission': ''
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})
