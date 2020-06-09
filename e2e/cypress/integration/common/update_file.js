import { When } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../support/commands'


const basic = 'http://localhost:1823/api/v1'

const textAfter = 'Good morning!'

When(/^The user send request for updating file "([^"]*)"$/, (fileName) => {
  const files = JSON.parse(Cypress.env('filesInRoot'))
  let hashFile = getHashFromFile(fileName, files)

  cy.writeFile(`cypress/fixtures/${fileName}`, textAfter).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(textAfter)

    let blob = new Blob([str], {type: 'text/plain'})

    const myHeaders = new Headers({
      'Authorization':  `Bearer ${Cypress.env('token')}`
    })

    let formData = new FormData()
    formData.append('hash', hashFile)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'PUT',
      headers: myHeaders,
      body: formData,
    }).then((resp) => {
      Cypress.env('respStatus', resp.status)
      return Promise.resolve(resp)
    })
      .then((resp) => {
        return resp.json()
      })
      .then((data) => {
        expect(Cypress.env('login')).to.equal(data.file.name)
      })
  }).as('Update txt file').wait(6000)
});