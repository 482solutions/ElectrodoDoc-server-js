import { Given } from 'cypress-cucumber-preprocessor/steps'

const URL = "http://localhost:1823/api/v1"

const myHeaders = new Headers({
  'Authorization': `Bearer ${Cypress.env('token')}`
})

Given(/^The user send request for upload file "([^"]*)"$/, (fullName) => {
  cy.readFile(`cypress/fixtures/${fullName}`).then((str) => {
    let blob = new Blob([str], { type: 'text/plain' })

    let formData = new FormData()
    formData.append('name', fullName)
    formData.append('parentFolder', Cypress.env('rootFolder'))
    formData.append('file', blob)

    fetch(`${URL}/file`, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    }).then((resp) => {
      Cypress.env('respStatus', resp.status)
      return Promise.resolve(resp)
    })
      .then((resp) => {
        return resp.json()
      })
      .then((data) => {
        Cypress.env('filesInRoot', data.folder.files)
        expect(Cypress.env('login')).to.equal(data.folder.name)
      })
  }).as('Send txt').wait(5000)
})