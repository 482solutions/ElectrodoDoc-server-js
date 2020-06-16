import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { sha256 } from 'js-sha256'

const headers = {
  'content-type': 'application/json'
}

Given(/^I send request for update password$/, () => {
  let newPassword = sha256('Albert123457')
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.wait(2000)
  cy.request({
    method: 'PUT',
    url: '/user',
    headers: headers,
    body: {
      'oldPassword': Cypress.env('password'),
      'newPassword': newPassword
    }
  }).then((resp) => {
    if(expect(200).to.equal(resp.status)) {
      Cypress.env('respStatus', resp.status)
      Cypress.env('password', newPassword)
    }
  })
})

Given(/^I send request for update password without Bearer$/, () => {
  let newPassword = sha256('123457Aldert')
  headers.Authorization = 'Bearer '
  cy.request({
    method: 'PUT',
    url: '/user',
    headers: headers,
    body: {
      'oldPassword': Cypress.env('password'),
      'newPassword': newPassword
    },
    failOnStatusCode: false
  }).then((resp) => {
    if(expect(203).to.equal(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
});

Given(/^I send request for update password to empty new password$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'PUT',
    url: '/user',
    headers: headers,
    body: {
      'oldPassword': Cypress.env('password'),
      'newPassword': ''
    },
    failOnStatusCode: false
  }).then((resp) => {
    if(expect(422).to.equal(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
});

Given(/^I send request for update password update request with the same data$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'PUT',
    url: '/user',
    headers: headers,
    body: {
      'oldPassword': Cypress.env('password'),
      'newPassword': Cypress.env('password')
    },
    failOnStatusCode: false
  }).then((resp) => {
    if(expect(422).to.equal(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
});
Given(/^I send request for update password without old password$/, () => {
  let newPassword = sha256('123457Aldert')
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'PUT',
    url: '/user',
    headers: headers,
    body: {
      'oldPassword': '',
      'newPassword': newPassword
    },
    failOnStatusCode: false
  }).then((resp) => {
    if(expect(422).to.equal(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
});

Given(/^I send request for update password to new password with spaces$/, function () {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'PUT',
    url: '/user',
    headers: headers,
    body: {
      'oldPassword': Cypress.env('password'),
      'newPassword': ' '
    },
    failOnStatusCode: false
  }).then((resp) => {
    if(expect(422).to.equal(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
});