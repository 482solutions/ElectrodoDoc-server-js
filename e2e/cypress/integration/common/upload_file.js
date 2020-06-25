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
    await fetch(`${URL}/file`, {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }),
      body: formData,
      redirect: 'follow'
    }).then((response) => {
      Cypress.env('respStatus', response.status)
      return response.json();
    }).then((result) => {
      Cypress.env('filesInRoot', result.folder.files)
      expect(Cypress.env('login')).to.equal(result.folder.folderName)
    });
  }).as('Send txt')
  cy.wait(3000)
})
