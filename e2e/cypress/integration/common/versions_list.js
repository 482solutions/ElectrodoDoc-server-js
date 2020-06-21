import { getHashFromFile } from '../../support/commands'
import { When } from 'cypress-cucumber-preprocessor/steps'

const headers = {
  'content-type': 'application/json'
}

When(/^Send request for list of the previous versions of "([^"]*)" file$/, (filename) => {
  cy.wait(3000)
  const files = Cypress.env('filesInRoot')

  let hash = getHashFromFile(filename, files)
  headers.Authorization = `Bearer ${Cypress.env('token')}`

  cy.request({
    method: 'GET',
    headers: headers,
    url: `/versions/${hash}`,
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
      Cypress.env('versions', resp.body.versions)
    }
  })
})