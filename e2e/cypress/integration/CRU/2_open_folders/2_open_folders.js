import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'

const headers = {
  'content-type': 'application/json'
}

let parseResp

When(/^The user sent a request to create a folder in the root folder with the name (.*)$/, (Names) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': Names,
      'parentFolder': Cypress.env('rootFolder')
    },
  }).then((resp) => {
    parseResp = resp.body.folder.folders
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^The user sent a request to receive a folder in the root folder with the name F$/, () => {
  expect('F').to.eq(parseResp[0].name)

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    url: `/folder/${parseResp[0].hash}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^The user sent a request to receive a folder in the root folder with the name Folder-1$/, () => {
  expect('Folder-1').to.eq(parseResp[1].name)

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    url: `/folder/${parseResp[1].hash}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^The user sent a request to receive a folder in the root folder with the name folder2$/, () => {
  expect('folder2').to.eq(parseResp[2].name)

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    url: `/folder/${parseResp[2].hash}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^The user sent a request to receive a folder in the root folder with the name FOLDER 3$/, () => {
  expect('FOLDER 3').to.eq(parseResp[3].name)

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    url: `/folder/${parseResp[3].hash}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^The user sent a request to receive a folder in the root folder with the name Folder12345678901234$/, () => {
  expect('Folder12345678901234').to.eq(parseResp[4].name)

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    url: `/folder/${parseResp[4].hash}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^The user sent a request to receive a folder in the root folder with the name Папка$/, () => {
  expect('Папка').to.eq(parseResp[5].name)

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    url: `/folder/${parseResp[5].hash}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^The user sent a request to receive a folder in the root folder with the name 資料 夾$/, () => {
  expect('資料夾').to.eq(parseResp[6].name)

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    url: `/folder/${parseResp[6].hash}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^The user sends a request for a folder without authorization$/, () => {
  expect('F').to.eq(parseResp[0].name)

  headers.Authorization = 'Bearer '
  cy.request({
    method: 'GET',
    url: `/folder/${parseResp[0].hash}`,
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

Given(/^The user sends a request for a folder with incorrect hash$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    url: '/folder/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})
