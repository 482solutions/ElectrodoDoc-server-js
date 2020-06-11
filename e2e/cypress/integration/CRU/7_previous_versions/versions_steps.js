import { When, Given } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

Given(/^The user send request for viewing previous version "([^"]*)" file$/, (fileName) => {
  let versions = JSON.parse(Cypress.env('versions'))
  expect(versions[0].cid).to.not.equal(versions[1].cid)
  const cid = versions[0].cid
  const files = JSON.parse(Cypress.env('filesInRoot'))
  const hash = getHashFromFile(fileName, files)

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(fileName).to.equal(resp.body.name)
    expect('Good night!').to.equal(resp.body.file)
  }).wait(2000)
})

When(/^The user send request for viewing previous version with incorrect bearer$/, function () {
  let versions = JSON.parse(Cypress.env('versions'))
  expect(versions[0].cid).to.not.equal(versions[1].cid)
  const cid = versions[0].cid
  const files = JSON.parse(Cypress.env('filesInRoot'))
  const hash = getHashFromFile('TestUpload.txt', files)

  headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

When(/^The user send request for viewing previous version bearer is empty$/, function () {
  let versions = JSON.parse(Cypress.env('versions'))
  expect(versions[0].cid).to.not.equal(versions[1].cid)
  const cid = versions[0].cid
  const files = JSON.parse(Cypress.env('filesInRoot'))
  const hash = getHashFromFile('TestUpload.txt', files)

  headers.Authorization = `Bearer `
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

When(/^The user send request for viewing previous version with incorrect hash$/, function () {
  let versions = JSON.parse(Cypress.env('versions'))
  expect(versions[0].cid).to.not.equal(versions[1].cid)
  const cid = versions[0].cid
  const files = JSON.parse(Cypress.env('filesInRoot'))
  const hash = '1234567887654345678987612345678876543456789876123456788743456786'

  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

after(() => {
  cy.writeFile('cypress/fixtures/TestUpload.txt', 'Good night!')
})
