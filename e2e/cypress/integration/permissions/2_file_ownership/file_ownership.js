import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

Given(/^"([^"]*)" sends request to transfer file ownership to "([^"]*)"$/, (fromUser, toUser) => {
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  switch (fromUser) {
    case 'User1':
      headers.Authorization = `Bearer ${Cypress.env('token')}`;
      break;
    case 'User2':
      headers.Authorization = `Bearer ${Cypress.env('token_2')}`;
      break;
    case 'User3':
      headers.Authorization = `Bearer ${Cypress.env('token_3')}`;
      break;
  } switch (toUser) {
    case 'User1':
      toUser = Cypress.env('email');
      break;
    case 'User2':
      toUser = Cypress.env('email_2');
      break;
    case 'User3':
      toUser = Cypress.env('email_3');
      break;
  }
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': toUser,
      'hash': file,
      'permission': 'owner',
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status);
    Cypress.env('respBody', resp.body);
  })
});

When(/^User2 can back to user1 file ownership$/,  () => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`;
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'));
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email'),
      'hash': file,
      'permission': 'owner',
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status);
    Cypress.env('respBody', resp.body);
  })
})

Given(/^User sends a request to transfer file ownership to nonexistent user$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer file ownership with Empty Bearer$/, () => {
  headers.Authorization = `Bearer `
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer file ownership without Bearer$/, () => {
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
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
    Cypress.env('respBody', resp.body)
    // expect('Not Authorized').to.equal(resp.body.message)
  })
})

Given(/^User sends a request to transfer file ownership with incorrect permission (.*)$/, (incPermission) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer file ownership with empty email$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer file ownership with empty permission$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
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
    Cypress.env('respBody', resp.body)
  })
})
Given(/^User sends a request to transfer file ownership to the user if he already has them$/,() => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email'),
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
