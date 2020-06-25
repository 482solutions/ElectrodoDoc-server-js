import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFolder } from '../../../support/commands'

const URL = 'http://localhost:1823/api/v1'

const headers = {
  'content-type': 'application/json'
}

When(/^User send request for create folder "([^"]*)" in root folder$/, (folderName) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': folderName,
      'parentFolder': Cypress.env('rootFolder')
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('folderInRoot', resp.body.folder.folders)
  })
})

When(/^The user send request for upload new file to testFolder with name "([^"]*)"$/, (fileName) => {
  cy.wait(2000)
  cy.readFile(`cypress/fixtures/${fileName}`).then(async (str) => {
    let blob = new Blob([str], { type: 'text/plain' })

    let folders = Cypress.env('folderInRoot')
    const createdFolder = getHashFromFolder('testFolder', folders)

    let formData = new FormData()
    formData.append('name', fileName)
    formData.append('parentFolder', createdFolder)
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
    Cypress.env('respStatus', resp.status)
    Cypress.env('filesInRoot', result.folder.files)
    expect('testFolder').to.equal(result.folder.folderName)
  }).as('Send txt')
})

When(/^The user send request for search file by name from list (.*)$/, (name) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    headers: headers,
    url: `/search/${name}`
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)

    for (let key in resp.body.files) {
      if (name === resp.body.files[key].name) {
        let countFiles = resp.body.files.length
        expect(resp.body.files[key].name).to.include(name)
        expect(0).to.not.equal(countFiles)
      }
    }

    for (let key in resp.body.folders) {
      if (name === resp.body.folders[key].name) {
        let countFiles = resp.body.files.length
        expect(resp.body.folders[key].name).to.include(name)
        expect(0).to.not.equal(countFiles)
      }
    }
  })
})

When(/^Send request for for search file without auth$/, () => {
  const name = 'mockTest'
  headers.Authorization = `Bearer `
  cy.request({
    method: 'GET',
    headers: headers,
    url: `/search/${name}`,
    failOnStatusCode: false,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})

When(/^Send request for for search file empty auth$/, () => {
  const name = 'mockTest'
  headers.Authorization = ``
  cy.request({
    method: 'GET',
    headers: headers,
    url: `/search/${name}`,
    failOnStatusCode: false,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  })
})
