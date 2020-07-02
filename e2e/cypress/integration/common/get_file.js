import { Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../support/commands'

Then(/^"([^"]*)" can send request for a file "([^"]*)"$/, (user, file) => {
  expect(Cypress.env('filesInRoot').length).to.equal(1)
  const headers = { 'content-type': 'application/json' }
  let cid = null
  let hash = getHashFromFile(file, Cypress.env('filesInRoot'))

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
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      expect(resp.headers['x-content-type-options']).to.equal(file);
      expect(resp.body).to.equal('Hello, world!');
      Cypress.env('respStatus', resp.status);
    }
  })
});


