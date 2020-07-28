import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../../support/commands'

const basic = 'http://localhost:1823/api/v1'

const files = Cypress.env('filesInRoot')

const textBefore = 'Good night!'
const textAfter = 'Good morning!'


When(/^The user send request for updating file "([^"]*)" and bearer is empty$/,  (fileName) => {
  let hashFile = getHashFromFile(fileName, files)
  cy.writeFile(`cypress/fixtures/${fileName}`, textAfter).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(textAfter)

    let blob = new Blob([str], {type: 'text/plain'})
    const myHeaders = new Headers({
      'Authorization':  `Bearer `
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
        expect(data.message).to.equal('Not Authorized')
      })
  }).as('Update txt file').wait(6000)
});

When(/^The user send request for updating file "([^"]*)" if the file is not exist$/, (fileName) => {
  cy.writeFile(`cypress/fixtures/${fileName}`, textAfter).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(textAfter)

    let blob = new Blob([str], {type: 'text/plain'})
    const myHeaders = new Headers({
      'Authorization':  `Bearer ${Cypress.env('token')}`
    })

    let formData = new FormData()
    formData.append('hash', 'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
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
        expect(data.message).to.equal('File with this hash does not exist')
      })
  }).as('Update txt file').wait(6000)
});

When(/^The user send request for updating file "([^"]*)" if the file is invalid$/, (fileName) => {
  let hashFile = getHashFromFile(fileName, files)

  cy.writeFile(`cypress/fixtures/${fileName}`, textAfter).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(textAfter)

    const myHeaders = new Headers({
      'Authorization':  `Bearer ${Cypress.env('token')}`
    })

    let formData = new FormData()
    formData.append('hash', hashFile)
    formData.append('file', 'invalidFile')

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
        expect(data.message).to.equal('Parent folder not found.')
      })
  }).as('Update txt file').wait(6000)
});

When(/^The user send request for updating file "([^"]*)" with incorrect bearer$/, (fileName) => {
  let hashFile = getHashFromFile(fileName, files)

  cy.writeFile(`cypress/fixtures/${fileName}`, textAfter).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(textAfter)

    let blob = new Blob([str], {type: 'text/plain'})
    const myHeaders = new Headers({
      'Authorization':  `Bearer incorrect`
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
        expect(data.message).to.equal('Not Authorized')
      })
  }).as('Update txt file').wait(6000)
});

after(() => {
  cy.writeFile('cypress/fixtures/TestUpload.txt', textBefore)
})
