import { Given } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFolder } from '../../support/commands'

const headers = {
  'content-type': 'application/json'
}

Given(/^"([^"]*)" send request for create folder in root folder with name "([^"]*)"$/,  (user, foldersName) => {
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
  })
});

Given(/^"([^"]*)" send request for create folder in folder Transfer with name "([^"]*)"$/, (user, foldername) => {
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
  const createdFolder = getHashFromFolder('Transfer', Cypress.env('foldersInRoot'))
  cy.request({
    method: 'POST',
    url: '/folder',
    headers: headers,
    body: {
      'name': foldername,
      'parentFolder': createdFolder
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
    //New folder in array:
    expect(Cypress.env('respBody').folders[0].folderName).to.equal(foldername)
    //ParentFolder:
    expect('Transfer').to.equal(resp.body.folder.folderName)
    Cypress.env('foldersInRoot', resp.body.folder.folders)
    Cypress.env('rootFolder', resp.body)
  })
});
