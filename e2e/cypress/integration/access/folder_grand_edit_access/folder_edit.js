import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFolder } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}
const URL = 'http://localhost:1823/api/v1'

When(/^The user1 sends a request to grant edit access to the folder "([^"]*)" to user1$/, (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFolder(foldername, Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email'),
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

When(/^The user1 sends a request to grant edit access to the folder "([^"]*)" to user2$/, (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFolder(foldername, Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

When(/^The user2 sends a request to grant edit access to the folder "([^"]*)" to user2$/,  (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const fileHash = getHashFromFolder(foldername, Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

When(/^The user1 sends a request to grant edit access to the folder "([^"]*)" to user3$/, (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const fileHash = getHashFromFolder(foldername, Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_3'),
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

Then(/^Verify that the user2 has the editor rights for "([^"]*)" folder$/,  (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  expect(Cypress.env('foldersInRoot').length).to.equal(1)

  const folders = Cypress.env('foldersInRoot')
  let hash = getHashFromFolder(foldername, folders)
  cy.request({
    method: 'GET',
    url: `/folder/${hash}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
    expect(foldername).to.equal(resp.body.folder.folderName)
  })
});

Then(/^Verify that the user3 has the editor rights for "([^"]*)" folder$/,  (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token_3')}`
  expect(Cypress.env('foldersInRoot').length).to.equal(1)

  const folders = Cypress.env('foldersInRoot')
  let hash = getHashFromFolder(foldername, folders)
  cy.request({
    method: 'GET',
    url: `/folder/${hash}`,
    headers: headers,
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
    expect(foldername).to.equal(resp.body.folder.folderName)
  })
});

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
When(/^The user1 sends a request to grant edit access to the folder "([^"]*)" to user with email "([^"]*)"$/,  (foldername, incorrectEmail) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFolder(foldername, Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': incorrectEmail,
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
When(/^The user1 sends a request to grant edit access to the folder "([^"]*)" to user2 and user3$/, (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFolder(foldername, Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': `${Cypress.env('email_2')}, ${Cypress.env('email_3')}`,
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

When(/^The user1 sends a request to grant edit access to the folder "([^"]*)" with empty email$/, (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFolder(foldername, Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': '',
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
When(/^The user1 sends a request to grant edit access to the folder "([^"]*)" with spaces in email$/,  (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFolder(foldername, Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': '       ',
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
When(/^The user1 sends a request to grant edit access to the folder "([^"]*)" with username in email$/,  (foldername) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const fileHash = getHashFromFolder(foldername, Cypress.env('foldersInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('login_2'),
      'hash': fileHash,
      'permission': 'write'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});
