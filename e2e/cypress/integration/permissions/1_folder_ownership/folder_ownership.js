import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFolder } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

Then(/^"([^"]*)" does not have access to folder Transfer$/,  (user) => {
  switch (user) {
    case 'User1':
      headers.Authorization = `Bearer ${Cypress.env('token')}`;
      break;
    case 'User2':
      headers.Authorization = `Bearer ${Cypress.env('token_2')}`;
      break;
    case 'User3':
      headers.Authorization = `Bearer ${Cypress.env('token_3')}`;
      break;
  }
  const parentFolder = Cypress.env('rootFolder').folder.parentFolderHash
  cy.request({
    method: 'GET',
    url: `/folder/${parentFolder}`,
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

Given(/^User sends a request to transfer folder ownership to nonexistent user$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = getHashFromFolder('Transfer', Cypress.env('foldersInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer folder ownership with Empty Bearer$/, () => {
  headers.Authorization = `Bearer `
  const folder = getHashFromFolder('Transfer', Cypress.env('foldersInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer folder ownership without Bearer$/, () => {
  const folder = getHashFromFolder('Transfer', Cypress.env('foldersInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer folder ownership with incorrect permission (.*)$/, (incPermission) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = getHashFromFolder('Transfer', Cypress.env('foldersInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer folder ownership with empty email$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = getHashFromFolder('Transfer', Cypress.env('foldersInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer folder ownership with empty permission$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = getHashFromFolder('Transfer', Cypress.env('foldersInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer folder ownership to the user if he already has them$/,() => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = getHashFromFolder('Transfer', Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email'),
      'hash': folder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
