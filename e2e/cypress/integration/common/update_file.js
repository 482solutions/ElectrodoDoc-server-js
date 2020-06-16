import { When } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../support/commands'

const basic = 'http://localhost:1823/api/v1'

const textAfter = 'Good morning!'
const textBefore = 'Good night!'

When(/^The user send request for updating file "([^"]*)"$/, (fileName) => {
  const files = Cypress.env('filesInRoot')
  let hashFile = getHashFromFile(fileName, files)

  cy.readFile(`cypress/fixtures/${fileName}`).then((str1) => {
    expect(str1).to.equal(textBefore)

    cy.writeFile(`cypress/fixtures/${fileName}`, textAfter).as('Write text to the file')
    cy.readFile(`cypress/fixtures/${fileName}`).then((str2) => {

      expect(str2).to.equal(textAfter)

      let blob = new Blob([str2], { type: 'text/plain' })

      const myHeaders = new Headers({
        'Authorization': `Bearer ${Cypress.env('token')}`
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
          // expect(Cypress.env('login')).to.equal(data.file.fileName)
        })
    }).as('Update txt file').wait(6000)
  })
})
