import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin, getCidFromFile, getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

before(() => {
  Cypress.env('login', getLogin())
  Cypress.env('password', getPassword())
  Cypress.env('email', getLogin() + '@gmail.com')
})

const files = JSON.parse(Cypress.env('filesInRoot'))

When(/^User sends a request for a file from the root folder$/, () => {
  expect(files.length).to.equal(1)

  let cid = getCidFromFile('mockTest', files)
  let hash = getHashFromFile('mockTest', files)

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    expect(resp.body.name).to.equal('mockTest')
    expect(resp.body.file).to.equal('Hello, world!')

    Cypress.env('respStatus', resp.status)
  })
})

When(/^User sends a request for a file from the root folder with incorrect cid$/, () => {
  expect(files.length).to.equal(1)

  let hash = getHashFromFile('mockTest', files)
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/incorrectCID`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
});

When(/^User sends a request for a file from the root folder with empty auth$/, () => {
  expect(files.length).to.equal(1)

  let cid = getCidFromFile('mockTest', files)
  let hash = getHashFromFile('mockTest', files)

  headers.Authorization = `Bearer `
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
});

When(/^User sends a request for a file by incorrect hash$/, () => {
  expect(files.length).to.equal(1)

  let cid = getCidFromFile('mockTest', files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
});

When(/^User sends a request for a file without hash$/, () => {
  expect(files.length).to.equal(1)

  let cid = getCidFromFile('mockTest', files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/*/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
});