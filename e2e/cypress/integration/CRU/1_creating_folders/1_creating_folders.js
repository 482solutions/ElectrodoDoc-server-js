import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

before(() => {
  Cypress.env('login', getLogin())
  Cypress.env('password', getPassword())
  Cypress.env('email', getLogin() + '@gmail.com')
})

Given(/^User send request for create folder in root folder with name (.*) from list$/, (foldersName) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': foldersName,
      'parentFolder': Cypress.env('rootFolder')
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^User send request for create folder in user's folder with name "([^"]*)"$/, (name) => {
  let rootFolder = Cypress.env('rootFolder')
  let folders = JSON.parse(rootFolder.folders)

  for (let key in folders) {
    if (name === folders[key].name) {
      let folder = folders[key].hash
      if (folder !== undefined) {

        headers.Authorization = `Bearer ${Cypress.env('token')}`
        cy.request({
          method: 'POST',
          url: '/folder',
          headers: headers,
          body: {
            'name': name,
            'parentFolder': folder
          },
        }).then((resp) => {
          Cypress.env('respStatus', resp.status)
        })
      }
    }
  }
})

Given(/^User send request for create folder in root folder without name$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': '',
      'parentFolder': Cypress.env('rootFolder')
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^User send request for create folder in root folder with name (.*) from list than 64 characters and more$/, (bigName) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': bigName,
      'parentFolder': Cypress.env('rootFolder')
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^User send request for create folder in root folder with existing name (.*) from list$/, (existingName) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': existingName,
      'parentFolder': Cypress.env('rootFolder')
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^User send request for create folder with spaces in folders name$/,  () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': '     ',
      'parentFolder': Cypress.env('rootFolder')
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^User send request for create folder without auth$/, () => {
  headers.Authorization = 'Bearer '
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': 'qwerty',
      'parentFolder': Cypress.env('rootFolder')
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})
