import { When } from 'cypress-cucumber-preprocessor/steps'

const URL = "http://localhost:1823/api/v1"

const myHeaders = new Headers({
  'Authorization': `Bearer ${Cypress.env('token')}`
})

When(/^User send request for upload txt file$/, () => {
  cy.readFile('cypress/fixtures/mockTest.txt').then((str) => {
    let blob = new Blob([str], { type: 'text/plain' })

    let formData = new FormData()
    formData.append('name', 'mockTest')
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