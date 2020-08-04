import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile, getHashFromFolder, getVoting } from '../../support/commands'

const headers = {
  'content-type': 'application/json'
}
When(/^The "([^"]*)" sends a request to revoke "([^"]*)" access to the "([^"]*)" "([^"]*)" from the "([^"]*)"$/,
  (fromUser,permission, object, name, toUser) => {
  switch (fromUser) {
    case 'User1':
      headers.Authorization = `Bearer ${Cypress.env('token')}`;
      break;
    case 'User2':
      headers.Authorization = `Bearer ${Cypress.env('token_2')}`;
      break;
    case 'User3':
      headers.Authorization = `Bearer ${Cypress.env('token_3')}`;
      break;
  } switch (toUser) {
    case 'User1':
      toUser = Cypress.env('email');
      break;
    case 'User2':
      toUser = Cypress.env('email_2');
      break;
    case 'User3':
      toUser = Cypress.env('email_3');
      break;
  } switch (object) {
    case 'file':
      object = getHashFromFile(name, Cypress.env('filesInRoot'));
      break;
    case 'folder':
      object = getHashFromFolder(name, Cypress.env('foldersInRoot'));
      break;
  } switch (permission) {
      case 'edit':
        permission = 'unwrite';
        break;
      case 'view':
        permission = 'unread';
        break;
    }
  cy.request({
    method: 'DELETE',
    url: '/permissions',
    headers: headers,
    body: {
      'email': toUser,
      'hash': object,
      'permission': permission
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

When(/^The "([^"]*)" sends a request to revoke "([^"]*)" access to the "([^"]*)" "([^"]*)" with "([^"]*)" email$/,
  (user, permission, object, name, email) => {
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
    } switch (permission) {
      case 'edit':
        permission = 'unwrite';
        break;
      case 'view':
        permission = 'unread';
        break;
    } switch (object) {
      case 'file':
        object = getHashFromFile(name, Cypress.env('filesInRoot'));
        break;
      case 'folder':
        object = getHashFromFolder(name, Cypress.env('foldersInRoot'));
        break;
    } switch (email) {
      case 'empty':
        email = ''
        break;
      case 'spaces in':
        email = '      '
        break;
      case 'username 2 in':
        email = Cypress.env('login_2')
        break;
      case 'username 3 in':
        email = Cypress.env('login_3')
        break;
    }
    cy.request({
      method: 'DELETE',
      url: '/permissions',
      headers: headers,
      body: {
        'email': email,
        'hash': object,
        'permission': permission
      },
      failOnStatusCode: false
    }).then((resp) => {
      Cypress.env('respStatus', resp.status)
      Cypress.env('respBody', resp.body)
    })
  });

Given(/^The "([^"]*)" sends a request to revoke "([^"]*)" access to the "([^"]*)" "([^"]*)" without "([^"]*)"$/,
  (user, permission, object, name, field) =>{
    switch (user) {
      case 'User1':
        headers.Authorization = `Bearer ${Cypress.env('token')}`;
        break;
      case 'User2':
        headers.Authorization = `Bearer ${Cypress.env('token_2')}`;
        break;
    }
    switch (permission) {
      case 'edit':
        permission = 'unwrite';
        break;
      case 'view':
        permission = 'unread';
        break;
    } switch (object) {
      case 'file':
        object = getHashFromFile(name, Cypress.env('filesInRoot'));
        break;
      case 'folder':
        object = getHashFromFolder(name, Cypress.env('foldersInRoot'));
        break;
    } switch (field) {
      case 'email':
        cy.request({
          method: 'PUT',
          url: '/permissions',
          headers: headers,
          body: {
            'hash': object,
            'permission': permission
          },
          failOnStatusCode: false
        }).then((resp) => {
          Cypress.env('respStatus', resp.status)
        })
        break;
      case 'permission':
        cy.request({
          method: 'PUT',
          url: '/permissions',
          headers: headers,
          body: {
            'email': `${Cypress.env('email_2')}`,
            'hash': object,
          },
          failOnStatusCode: false
        }).then((resp) => {
          Cypress.env('respStatus', resp.status)
        })
        break;
      case 'hash':
        cy.request({
          method: 'PUT',
          url: '/permissions',
          headers: headers,
          body: {
            'email': `${Cypress.env('email_2')}`,
            'permission': permission
          },
          failOnStatusCode: false
        }).then((resp) => {
          Cypress.env('respStatus', resp.status)
        })
        break;
    }
});

Given(/^The "([^"]*)" sends a request to revoke "([^"]*)" access to the "([^"]*)" "([^"]*)" "([^"]*)" to "([^"]*)"$/,
  (userFrom, permission, object, name, bearer, toUser) => {
    switch (userFrom) {
      case 'User1':
        headers.Authorization = `Bearer ${Cypress.env('token')}`;
        break;
      case 'User2':
        headers.Authorization = `Bearer ${Cypress.env('token_2')}`;
        break;
    } switch (toUser) {
      case 'User2':
        toUser = Cypress.env('email_2');
        break;
      case 'User3':
        toUser = Cypress.env('email_3');
        break;
    } switch (permission) {
      case 'edit':
        permission = 'unwrite';
        break;
      case 'view':
        permission = 'unread';
        break;
    } switch (object) {
      case 'file':
        object = getHashFromFile(name, Cypress.env('filesInRoot'));
        break;
      case 'folder':
        object = getHashFromFolder(name, Cypress.env('foldersInRoot'));
        break;
    } switch (bearer) {
      case 'with empty Bearer':
        headers.Authorization = 'Bearer ';
        break;
      case 'without Bearer':
        headers.Authorization = '';
        break;
      case 'incorrect Bearer':
        headers.Authorization =
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        break
    }
    cy.request({
      method: 'DELETE',
      url: '/permissions',
      headers: headers,
      body: {
        'email': toUser,
        'hash': object,
        'permission': permission
      },
      failOnStatusCode: false
    }).then((resp) => {
      Cypress.env('respStatus', resp.status)
    })
});
