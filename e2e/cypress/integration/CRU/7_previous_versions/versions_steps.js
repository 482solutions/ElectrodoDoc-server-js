import { Given, When } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

Given(/^The user send request for viewing previous version "([^"]*)" file$/, (fileName) => {
  let versions = Cypress.env('versions')
  expect(versions[0].cid).to.not.equal(versions[1].cid)

  const files = Cypress.env('filesInRoot')
  const hash = getHashFromFile(fileName, files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${versions[0].cid}`
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    // expect(fileName).to.equal(resp.headers["x-content-type-options"])
    expect('Good night!').to.equal(resp.body)
  })
})

When(/^The user send request for viewing previous version with incorrect bearer$/, function() {
  let versions = Cypress.env('versions')
  expect(versions[0].cid).to.not.equal(versions[1].cid)
  const cid = versions[0].cid
  const files = Cypress.env('filesInRoot')
  const hash = getHashFromFile('TestUpload.txt', files)

  headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    expect('Not Authorized').to.equal(resp.body.message)
    Cypress.env('respStatus', resp.status)
  })
})

When(/^The user send request for viewing previous version bearer is empty$/, function() {
  let versions = Cypress.env('versions')
  expect(versions[0].cid).to.not.equal(versions[1].cid)
  const cid = versions[0].cid
  const files = Cypress.env('filesInRoot')
  const hash = getHashFromFile('TestUpload.txt', files)

  headers.Authorization = `Bearer `
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    expect('Not Authorized').to.equal(resp.body.message)
    Cypress.env('respStatus', resp.status)
  })
})

When(/^The user send request for viewing previous version with incorrect hash$/, function() {
  let versions = Cypress.env('versions')
  expect(versions[0].cid).to.not.equal(versions[1].cid)
  const cid = versions[0].cid
  const files = Cypress.env('filesInRoot')
  const hash = '1234567887654345678987612345678876543456789876123456788743456786'

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

after(() => {
  cy.writeFile('cypress/fixtures/TestUpload.txt', 'Good night!')
})
