import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'

const headers = {
  'content-type': 'application/json'
}

Given(/^I send request for logout$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.wait(2000)
  cy.request({
    method: 'DELETE',
    url: '/user/logout',
    headers: headers
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
})

Given(/^I send request for logout without token$/, () => {
  headers.Authorization = `Bearer `
  cy.request({
    method: 'DELETE',
    url: '/user/logout',
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    if (expect(203).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
})

Given(/^I send request for logout with incorrect token$/,  () => {
  headers.Authorization = 'Bearer incorrectToken'
  cy.request({
    method: 'DELETE',
    url: '/user/logout',
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    if (expect(203).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
})
