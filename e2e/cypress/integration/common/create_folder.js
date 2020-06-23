import { Given } from 'cypress-cucumber-preprocessor/steps'

const headers = {
  'content-type': 'application/json'
}

Given(/^User1 send request for create folder in root folder with name "([^"]*)"$/,  (foldersName) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': foldersName,
      'parentFolder': Cypress.env('rootFolder')
    },
  }).then((resp) => {
    Cypress.env('foldersInRoot', resp.body.folder.folders)
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
});