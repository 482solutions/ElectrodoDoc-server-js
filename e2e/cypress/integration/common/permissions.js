import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile, getHashFromFolder } from '../../support/commands'

const headers = {
  'content-type': 'application/json'
}

Then(/^"([^"]*)" is the owner of the file$/, (user) => {
  switch (user) {
    case 'User1':
      expect(Cypress.env('login')).to.equal(Cypress.env('respBody').response.ownerId);
      break;
    case 'User2':
      expect(Cypress.env('login_2')).to.equal(Cypress.env('respBody').response.ownerId);
      break;
    case 'User3':
      expect(Cypress.env('login_3')).to.equal(Cypress.env('respBody').response.ownerId)
      break;
  }
});

Then(/^"([^"]*)" is the owner of the folder$/, (user) => {
  switch (user) {
    case 'User1':
      expect(Cypress.env('login')).to.equal(Cypress.env('respBody').response.ownerId);
      break;
    case 'User2':
      expect(Cypress.env('login_2')).to.equal(Cypress.env('respBody').response.ownerId);
      break;
    case 'User3':
      expect(Cypress.env('login_3')).to.equal(Cypress.env('respBody').response.ownerId);
      break;
  }
});

Then(/^"([^"]*)" not in editors list$/,  (user) => {
  switch (user) {
    case 'User1':
      expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login'))).to.be.false;
      break;
    case 'User2':
      expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_2'))).to.be.false;
      break;
    case 'User3':
      expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_3'))).to.be.false;
      break;
  }
});

Then(/^"([^"]*)" not in viewer list$/,  (user) => {
  switch (user) {
    case 'User1':
      expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login'))).to.be.false;
      break;
    case 'User2':
      expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_2'))).to.be.false;
      break;
    case 'User3':
      expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_3'))).to.be.false;
      break;
  }
});

Then(/^"([^"]*)" is the editor and viewer$/,  (user) => {
  switch (user) {
    case 'User1':
      expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login'))).to.be.true;
      expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login'))).to.be.true;
      break;
    case 'User2':
      expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_2'))).to.be.true;
      expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_2'))).to.be.true;
      break;
    case 'User3':
      expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_3'))).to.be.true;
      expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_3'))).to.be.true;
      break;
  }
});

Then(/^"([^"]*)" is the viewer$/,  (user) => {
  switch (user) {
    case 'User1':
      expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login'))).to.be.true;
      break;
    case 'User2':
      expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_2'))).to.be.true;
      break;
    case 'User3':
      expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_3'))).to.be.true;
      break;
  }
});

When(/^The "([^"]*)" sends a request to grant "([^"]*)" access to the "([^"]*)" "([^"]*)" to "([^"]*)"$/,
  (fromUser, permission, object, name, toUser) => {
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
  } switch (permission) {
    case 'edit':
      permission = 'write';
      break;
      case 'view':
        permission = 'read';
        break;
  } switch (object) {
    case 'file':
      object = getHashFromFile(name, Cypress.env('filesInRoot'));
      break;
    case 'folder':
      object = getHashFromFolder(name, Cypress.env('foldersInRoot'));
      break;
  }
  cy.request({
    method: 'PUT',
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

Then(/^Verify that the "([^"]*)" has the rights for "([^"]*)" "([^"]*)"$/,  (user, name, obj) => {
  let path;
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
  } switch (obj) {
    case 'folder':
      expect(Cypress.env('foldersInRoot').length).to.equal(1)
      obj = getHashFromFolder(name, Cypress.env('foldersInRoot'));
      path = `/folder/${obj}`
      break;
    case 'file':
      obj = getHashFromFile(name, Cypress.env('filesInRoot'));
      path = `/file/${obj}/${null}`
      break;
  }
  cy.request({
    method: 'GET',
    url: path,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

When(/^The "([^"]*)" sends a request to grant "([^"]*)" access to the "([^"]*)" "([^"]*)" with "([^"]*)" email$/,
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
        permission = 'write';
        break;
      case 'view':
        permission = 'read';
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
      case 'username in':
        email = Cypress.env('login_2')
        break;
    }
    cy.request({
      method: 'PUT',
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

When(/^The user1 sends a request to grant "([^"]*)" access to the "([^"]*)" "([^"]*)" to user2 and user3$/,  (permission, object, filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  switch (permission) {
    case 'edit':
      permission = 'write';
      break;
    case 'view':
      permission = 'read';
      break;
  } switch (object) {
    case 'file':
      object = getHashFromFile(name, Cypress.env('filesInRoot'));
      break;
    case 'folder':
      object = getHashFromFolder(name, Cypress.env('foldersInRoot'));
      break;
  }
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': `${Cypress.env('email_2')}, ${Cypress.env('email_3')}`,
      'hash': fileHash,
      'permission': permission
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

Given(/^The user1 sends a request to grant "([^"]*)" access to the "([^"]*)" "([^"]*)" without "([^"]*)"$/,
  (permission, object, name, field) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  switch (permission) {
    case 'edit':
      permission = 'write';
      break;
    case 'view':
      permission = 'read';
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
    case 'permissions':
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
