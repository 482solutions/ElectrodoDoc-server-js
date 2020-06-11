import { Given } from 'cypress-cucumber-preprocessor/steps'

const URL = 'http://localhost:1823/api/v1'

Given(/^The user send request for upload file "([^"]*)"$/, (fullName) => {
  cy.readFile(`cypress/fixtures/${fullName}`).then(async (str) => {
    let blob = new Blob([str], { type: 'text/plain' })

    let formData = new FormData()
    formData.append('name', fullName)
    formData.append('parentFolder', Cypress.env('rootFolder'))
    formData.append('file', blob)

    const token = Cypress.env('token')
    const resp = await fetch(`${URL}/file`, {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }),
      body: formData,
      redirect: 'follow'
    })
    const result = await resp.json()
    if (expect(200).to.eq(resp.status)) {
      Cypress.env('respStatus', resp.status)
      Cypress.env('filesInRoot', result.folder.files)
      expect(Cypress.env('login')).to.equal(result.folder.name)
    }
  }).as('Send txt')
  cy.wait(5000)
})