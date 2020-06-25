import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../../support/commands'

const headers = {
  'content-type': 'application/json'
}
Given(/^User sends request to transfer file ownership to user2$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': 'owner'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
})

Then(/^User 2 is the owner of the file$/, () => {
  expect(Cypress.env('login_2')).to.equal(Cypress.env('respBody').response.ownerId)
});

When(/^User2 can back to user1 file ownership$/,  () => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email'),
      'hash': file,
      'permission': 'owner'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends request to transfer file ownership to user3$/,  () => {
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_3'),
      'hash': file,
      'permission': 'owner'
    },
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
})

Then(/^Verify that the user1 has a file "([^"]*)"$/,  (filename) => {
  expect(Cypress.env('filesInRoot').length).to.equal(1)
  const cid = null
  const hash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      expect(resp.body.name).to.equal(filename)
      expect(resp.body.file).to.equal('Hello, world!')
      Cypress.env('respStatus', resp.status)
      Cypress.env('respBody', resp.body)
    }
  })
})

Then(/^Verify that the user2 has a file "([^"]*)"$/, (filename) => {
  const cid = null
  const hash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  headers.Authorization = `Bearer ${Cypress.env('token_2')}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      expect(resp.body.name).to.equal(filename)
      expect(resp.body.file).to.equal('Hello, world!')
      Cypress.env('respStatus', resp.status)
      Cypress.env('respBody', resp.body)
    }
  })
})

Then(/^Verify that the user3 has a file "([^"]*)"$/,  (filename) => {
  headers.Authorization = `Bearer ${Cypress.env('token_3')}`
  let cid = null
  let hash = getHashFromFile(filename, Cypress.env('filesInRoot'))
  cy.request({
    headers: headers,
    method: 'GET',
    url: `/file/${hash}/${cid}`
  }).then((resp) => {
    if (expect(200).to.eq(resp.status)) {
      expect(resp.body.name).to.equal(filename)
      expect(resp.body.file).to.equal('Hello, world!')
      Cypress.env('respStatus', resp.status)
      Cypress.env('respBody', resp.body)
    }
  })
})

Given(/^User sends a request to transfer file ownership to nonexistent user$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': 'nonexist@gmail.com',
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer of rights to a nonexistent file$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const hakeFile = 'jsefklefjiewfbhvskjdu4h34h3cj3jhcbhjvj4csfadsfutsie352353mvsdr43'
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': hakeFile,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer file ownership with Empty Bearer$/, () => {
  headers.Authorization = `Bearer `
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer file ownership without Bearer$/, () => {
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
    // expect('Not Authorized').to.equal(resp.body.message)
  })
})

Given(/^User sends a request to transfer file ownership with incorrect permission (.*)$/, (incPermission) => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': incPermission
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer file ownership with empty email$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': '',
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer file ownership with empty hash$/, () => {
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
    Cypress.env('respBody', resp.body)
  })
})

Given(/^User sends a request to transfer file ownership with empty permission$/, () => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email_2'),
      'hash': file,
      'permission': ''
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
})
Given(/^User sends a request to transfer file ownership to the user if he already has them$/,() => {
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  const file = getHashFromFile("mockTest.txt", Cypress.env('filesInRoot'))
  cy.request({
    method: 'PUT',
    url: '/permissions',
    headers: headers,
    body: {
      'email': Cypress.env('email'),
      'hash': file,
      'permission': 'owner'
    },
    failOnStatusCode: false
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
  })
});

Then(/^User 1 is the editor and viewer of the file$/,  () => {
  expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login'))).to.be.true
  expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login'))).to.be.true
});

Then(/^User 2 is the editor and viewer of the file$/,  () => {
  expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_2'))).to.be.true
  expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_2'))).to.be.true
});

Then(/^User 3 is the editor and viewer of the file$/,  () => {
  expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_3'))).to.be.true
  expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_3'))).to.be.true
});
