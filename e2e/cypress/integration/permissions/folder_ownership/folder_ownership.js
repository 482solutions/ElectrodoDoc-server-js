import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile, getHashFromFolder } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}
let parentHash

Given(/^User sends request to transfer folder ownership to user2$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
      'permission': 'owner'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(Cypress.env('login_2')).to.equal(resp.body.response.ownerId)
    /*
    Previous owner has read and edit permissions:
     */
    expect(Cypress.env('login')).to.equal(resp.body.response.readUsers[0])
    expect(Cypress.env('login')).to.equal(resp.body.response.writeUsers[0])
  }).wait(2000)
})

When(/^User sends request to transfer folder ownership to user3$/,  () => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_3'),
      'hash': folder,
      'permission': 'owner'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(Cypress.env('login_3')).to.equal(resp.body.response.ownerId)
    /*
   And previous owners have permissions to 'write' and 'read':
    */
    expect(Cypress.env('login')).to.equal(resp.body.response.readUsers[0])
    expect(Cypress.env('login')).to.equal(resp.body.response.writeUsers[0])
    expect(Cypress.env('login_2')).to.equal(resp.body.response.readUsers[1])
    expect(Cypress.env('login_2')).to.equal(resp.body.response.writeUsers[1])
  }).wait(2000)
});

When(/^User2 can back to user1 folder ownership$/,  () => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email'),
      'hash': folder,
      'permission': 'owner'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(Cypress.env('login')).to.equal(resp.body.response.ownerId)
    /*
    Second owner has 'read' and 'edit' permissions:
     */
    expect(Cypress.env('login_2')).to.equal(resp.body.response.readUsers[1])
    expect(Cypress.env('login_2')).to.equal(resp.body.response.writeUsers[1])
    /*
    Owner has 'read' and 'edit' permissions:
     */
    expect(Cypress.env('login')).to.equal(resp.body.response.readUsers[0])
    expect(Cypress.env('login')).to.equal(resp.body.response.writeUsers[0])
  }).wait(2000)
});

Then(/^Verify that the user1 has a folder "([^"]*)"$/,  (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'GET',
    url: `/folder/${folder}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(foldername).to.equal(resp.body.folder.folderName)
    expect(Cypress.env('login')).to.equal(resp.body.folder.ownerId)
    /*
    And previous owner has permissions to write and read:
     */
    expect(Cypress.env('login')).to.equal(resp.body.folder.readUsers[0])
    expect(Cypress.env('login')).to.equal(resp.body.folder.writeUsers[0])
  })
});

Then(/^Verify that the user2 has a folder "([^"]*)"$/, (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const folders = Cypress.env('foldersInRoot')
  let hash = getHashFromFolder(foldername, folders)
  cy.request({
    method: 'GET',
    url: `/folder/${hash}`,
    headers: headers,
  }).then((resp) => {
    console.log(resp.body)
    Cypress.env('respStatus', resp.status)
    expect(foldername).to.equal(resp.body.folder.folderName)
    expect(Cypress.env('login_2')).to.equal(resp.body.folder.ownerId)
    /*
    And previous owner has permissions to 'write' and 'read':
     */
    expect(Cypress.env('login')).to.equal(resp.body.folder.readUsers[0])
    expect(Cypress.env('login')).to.equal(resp.body.folder.writeUsers[0])
  })
})

Then(/^Verify that the user3 has a folder "([^"]*)"$/,(foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token_3')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'GET',
    url: `/folder/${folder}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    expect(foldername).to.equal(resp.body.folder.folderName)
    expect(Cypress.env('login_3')).to.equal(resp.body.folder.ownerId)
    /*
    And previous owners have permissions to 'write' and 'read':
     */
    expect(Cypress.env('login')).to.equal(resp.body.folder.readUsers[0])
    expect(Cypress.env('login')).to.equal(resp.body.folder.writeUsers[0])
    expect(Cypress.env('login_2')).to.equal(resp.body.folder.readUsers[1])
    expect(Cypress.env('login_2')).to.equal(resp.body.folder.writeUsers[1])
  })
});

Given(/^User1 send request for create folder in folder Transfer with name "([^"]*)"$/, (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const createdFolder = Cypress.env('foldersInRoot')[0].hash
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
    //New folder in array:
    expect(foldername).to.equal(resp.body.folder.folders[0].name)
    //ParentFolder:
    expect(Cypress.env('foldersInRoot')[0].name).to.equal(resp.body.folder.folderName)
    Cypress.env('foldersInRoot', resp.body.folder.folders)
  })
});

When(/^User sends request to transfer of ownership to the "([^"]*)" to user2$/,  (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folders = Cypress.env('foldersInRoot')
  let hash = getHashFromFolder(foldername, folders)
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': hash,
      'permission': 'owner'
    },
  }).then((resp) => {
    parentHash = resp.body.response.parentFolderHash

    Cypress.env('respStatus', resp.status)
    expect(Cypress.env('login_2')).to.equal(resp.body.response.ownerId)
    /*
    Second owner has 'read' and 'edit' permissions:
     */
    expect(Cypress.env('login')).to.equal(resp.body.response.readUsers[0])
    expect(Cypress.env('login')).to.equal(resp.body.response.writeUsers[0])
  })
});

Then(/^User2 does not have access to folder Transfer$/,  () => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  cy.request({
    method: 'GET',
    url: `/folder/${parentHash}`,
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    expect('You does not have permission').to.equal(resp.body.message)
  })
});

Given(/^User sends a request to transfer folder ownership to nonexistent user$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': 'nonexist@gmail.com',
      'hash': folder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer of rights to a nonexistent folder$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const hakeFolder = 'jsefklefjiewfbhvskjdu4h34h3cj3jhcbhjvj4csfadsfutsie352353mvsdr43'
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': hakeFolder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer of incorrect rights OWNER$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
      'permission': 'OWNER'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership with Empty Bearer$/, () => {
  headers.Authorization = `Bearer `
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': 'nonexist@gmail.com',
      'hash': folder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership without Bearer$/, () => {
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership with incorrect permission (.*)$/, (incPermission) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
      'permission': incPermission
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership with empty email$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': '',
      'hash': folder,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership with empty hash$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': '',
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})

Given(/^User sends a request to transfer folder ownership with empty permission$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const folder = Cypress.env('foldersInRoot')[0].hash
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': folder,
      'permission': ''
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
  }).wait(2000)
})
