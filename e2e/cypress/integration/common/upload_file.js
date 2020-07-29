import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFolder } from '../../support/commands'

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
      Cypress.env('respBody', result.folder)
      expect(Cypress.env('login')).to.equal( result.folder.ownerId);
      expect(Cypress.env('login')).to.equal(result.folder.folderName)
    });
  }).as('Send txt')
  cy.wait(3000)
})


Then(/^User can upload file "([^"]*)" to the folder "([^"]*)"$/,  (file, foldername) => {
  cy.readFile(`cypress/fixtures/${file}`).then(async (str) => {
    let blob = new Blob([str], { type: 'text/plain' })

    const folders = Cypress.env('foldersInRoot')
    let createdFolder = getHashFromFolder(foldername, folders)

    let formData = new FormData()
    formData.append('name', file)
    formData.append('parentFolder', createdFolder)
    formData.append('file', blob)

    const resp = await fetch(`${URL}/file`, {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${Cypress.env('token')}`
      }),
      body: formData,
      redirect: 'follow'
    })
    const result = await resp.json()
    Cypress.env('respStatus', resp.status)
    expect(file).to.equal(result.folder.files[0].name)
    expect('Transfer').to.equal(result.folder.folderName)
  }).as('Send txt')
});
