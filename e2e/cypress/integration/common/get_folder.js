import { Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFolder } from '../../support/commands'

Then(/^"([^"]*)" can send request for a folder "([^"]*)"$/,  (user, folder) => {
  const headers = { 'content-type': 'application/json' }
  let hash = getHashFromFolder(folder, Cypress.env('foldersInRoot'));
  switch (user) {
    case 'User1':
      headers.Authorization = `Bearer ${Cypress.env('token')}`;
      break;
    case 'User2':
      headers.Authorization = `Bearer ${Cypress.env('token_2')}`;
      break;
    case 'User3':
      headers.Authorization = `Bearer ${Cypress.env('token_3')}`;
      break;
  }
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'GET',
    url: `/folder/${hash}`,
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
