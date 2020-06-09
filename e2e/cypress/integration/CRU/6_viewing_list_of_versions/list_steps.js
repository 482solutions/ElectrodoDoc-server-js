import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin, getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

before(() => {
  Cypress.env('login', getLogin())
  Cypress.env('password', getPassword())
  Cypress.env('email', getLogin() + '@gmail.com')
})

const files = JSON.parse(Cypress.env('filesInRoot'))

const textBefore = 'Good night!'

When(/^Send request for list of the previous versions of "([^"]*)" file$/, (filename) => {
  let hash = getHashFromFile(filename, files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`

  cy.request({
    method: 'GET',
    headers: headers,
    url: `/versions/${hash}`,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('versions', resp.body.message)
    console.log( Cypress.env('versions'))
  })
})

Then(/^Response should contain 2 different cid$/, () => {
  let versions = JSON.parse(Cypress.env('versions'))
  expect(versions.length).to.equal(2)
  expect(versions[0].cid).to.not.equal(versions[1].cid)
})

When(/^The user send request for list of previous version with incorrect bearer$/, () => {
  let hash = getHashFromFile('TestUpload.txt', files)
  headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
  cy.request({
    method: 'GET',
    headers: headers,
    url: `/versions/${hash}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

When(/^The user send request for list if bearer is empty$/, function () {
  let hash = getHashFromFile('TestUpload.txt', files)
  headers.Authorization = `Bearer `
  cy.request({
    method: 'GET',
    headers: headers,
    url: `/versions/${hash}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

When(/^The user send request for get list with incorrect hash$/, function () {
  let hash = getHashFromFile('Tes', files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    headers: headers,
    url: `/versions/${hash}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

after(() => {
  cy.writeFile('cypress/fixtures/TestUpload.txt', textBefore)
})