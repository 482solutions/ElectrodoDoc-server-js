import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const basic = 'api/v1'
const headers = {
  'content-type': 'application/json'
}

let user, token, login, email, password, cert, csr, privateKey, folderData

before(() => {
  login = getLogin() + 'list'
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })
  privateKey = cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
})

/*
  Expect response status:
 */

Then(/^Response status 200 list$/, function () {
  expect(200).to.eq(user.status)
});

Then(/^Response status 203 list$/, function () {
  expect(203).to.eq(user.status)
});

Then(/^Response status 404 list$/, function () {
  expect(404).to.eq(user.status)
});

/*
  Implementation of the steps from **.feature
 */

Given(/^Send request for create user for getting list of versions$/, () => {
  cy.request({
    method: 'POST',
    url: `${basic}/user`,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'CSR': csr.csrPem
    },
  }).as('Register')
    .then((resp) => {
      user = resp
      cert = cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert)
        .then(() => {
          cert = cy.readFile('cypress/fixtures/cert.pem')
        })
    }).fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((privateKey) => {
      cy.request({
        method: 'POST',
        url: `${basic}/user/auth`,
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': cert,
          'privateKey': privateKey,
        },
      }).as('Login')
        .then((resp) => {
          token = resp.body.token
          // user = resp
        })
    })
  })
});

const textBefore = 'Hello, World!'
const textAfter = 'Good Morning!'

Given(/^The user send request for upload txt file$/, () => {
  cy.writeFile('cypress/fixtures/TestUpload.txt', textBefore)
  cy.readFile('cypress/fixtures/TestUpload.txt').then((str) => {

    expect(str).to.equal(textBefore)
    let blob = new Blob([str], { type: 'text/plain' })
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`
    })
    let formData = new FormData()
    formData.append('name', 'TestUpload')
    formData.append('parentFolder', user.body.folder)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    }).then((response) => {
      console.log(response.status)
      user = response
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
      console.log(data)
    })
  }).as('Send txt').wait(2000)
});

Given(/^Change txt file$/, function () {
  cy.writeFile('cypress/fixtures/TestUpload.txt', textAfter)
});

Given(/^The user send request for updating txt file$/, function () {
  cy.readFile('cypress/fixtures/TestUpload.txt').then((str) => {

    expect(str).to.equal(textAfter)

    let blob = new Blob([str], { type: 'text/plain' })
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`
    })
    let formData = new FormData()
    formData.append('name', 'TestUpload')
    formData.append('parentFolder', user.body.folder)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    }).then((response) => {
      console.log(response.status)
      user = response
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
      console.log(data)
    })
  }).as('Send txt').wait(2000)
});

after(() => {
  cy.writeFile('cypress/fixtures/TestUpload.txt', textBefore)
})