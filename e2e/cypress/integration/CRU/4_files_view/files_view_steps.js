import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getCidFromFile, getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

When(/^User sends a request for a file from the root folder$/, () => {
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
      expect(resp.headers["x-content-type-options"]).to.equal('mockTest.txt')
      expect(resp.body).to.equal('Hello, world!')
      Cypress.env('respStatus', resp.status)
    }
  })
})

When(/^User sends a request for a file from the root folder with incorrect cid$/, () => {
  const files = Cypress.env('filesInRoot')
  expect(files.length).to.equal(1)

  let hash = getHashFromFile('mockTest', files)
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/incorrectCID`,
    failOnStatusCode: false
  }).then((resp) => {
    if (expect(404).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
});

When(/^User sends a request for a file from the root folder with empty auth$/, () => {
  const files = Cypress.env('filesInRoot')
  expect(files.length).to.equal(1)

  let cid = null
  let hash = getHashFromFile('mockTest', files)

  headers.Authorization = `Bearer `
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    if (expect(203).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
});

When(/^User sends a request for a file by incorrect hash$/, () => {
  const files = Cypress.env('filesInRoot')
  expect(files.length).to.equal(1)

  let cid = getCidFromFile('mockTest', files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    if (expect(404).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
});

When(/^User sends a request for a file without hash$/, () => {
  const files = Cypress.env('filesInRoot')
  expect(files.length).to.equal(1)

  let cid = getCidFromFile('mockTest', files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/*/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    if (expect(404).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
});
