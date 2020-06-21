import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}

const textBefore = 'Good night!'

Then(/^Response should contain 2 different cid$/, () => {
  let versions = Cypress.env('versions')
  expect(versions.length).to.equal(2)
  expect(versions[0].cid).to.not.equal(versions[1].cid)
})

Then(/^Response should contain time and user properties$/, function () {
  let versions = Cypress.env('versions')
  expect(versions[0]).to.have.property('time')
  expect(versions[0]).to.have.property('user')
  expect(versions[0].user).to.equal(Cypress.env('login'))

  expect(versions[1]).to.have.property('time')
  expect(versions[1]).to.have.property('user')
  expect(versions[1].user).to.equal(Cypress.env('login'))
});

When(/^The user send request for list of previous version with incorrect bearer$/, () => {
  const files = Cypress.env('filesInRoot')
  let hash = getHashFromFile('TestUpload.txt', files)
  headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
  cy.request({
    method: 'GET',
    headers: headers,
    url: `/versions/${hash}`,
    failOnStatusCode: false
  }).then((resp) => {
    if (expect(203).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }
  })
})

When(/^The user send request for list if bearer is empty$/,  () => {
  const files = Cypress.env('filesInRoot')
  let hash = getHashFromFile('TestUpload.txt', files)
  headers.Authorization = `Bearer `
  cy.request({
    method: 'GET',
    headers: headers,
    url: `/versions/${hash}`,
    failOnStatusCode: false
  }).then((resp) => {
    if (expect(203).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }  })
})

When(/^The user send request for get list with incorrect hash$/, () => {
  const files = Cypress.env('filesInRoot')
  let hash = getHashFromFile('Tes', files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    headers: headers,
    url: `/versions/${hash}`,
    failOnStatusCode: false
  }).then((resp) => {
    if (expect(404).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
    }  })
})

after(() => {
  cy.writeFile('cypress/fixtures/TestUpload.txt', textBefore)
})