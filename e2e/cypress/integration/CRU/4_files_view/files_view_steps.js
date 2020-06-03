import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const basic = 'http://localhost:1823/api/v1'

const headers = {
  'content-type': 'application/json'
}

let user, token, login, email, password, cert, csr, privateKey, folderData

let getHashFromFile = (fileName, folders) => {
  let files = JSON.parse(folders.folder.files)
  for (let key in files) {
    if (fileName === files[key].name) {
      return files[key].hash
      //TODO add CID
    }
  }
}

before('Get user data', () => {
  login = getLogin() + 'JWT'
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })
  privateKey = cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
})

/*
  Expect response status:
 */

When(/^Response status 200 view$/, () => {
  expect(200).to.eq(user.status)
})

Then(/^Response status 203 view$/, () => {
  expect(203).to.eq(user.status)
})

Then(/^Response status 404 view$/, () => {
  expect(404).to.eq(user.status)
})

/*
  Implementation of the steps from **.feature
 */

Given(/^Send request for create user for viewing file$/, function () {
  cy.request({
    method: 'POST',
    url: basic + '/user',
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
          user = resp
        })
    })
  })
})

When(/^The user send request for upload file$/, function () {
  cy.readFile('cypress/fixtures/mockTest.txt').then((str) => {
    let blob = new Blob([str], { type: 'text/plain' })
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`
    })
    let formData = new FormData()
    formData.append('name', 'mockTest')
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
})

When(/^User sends a request for a file from the root folder$/, function () {
  let hash = getHashFromFile('mockTest', folderData)
  headers.Authorization = 'Bearer ' + token
  cy.request({
    headers: headers,
    method: 'GET',
    url: `${basic}/file/${hash}`
  }).then((resp) => {
    user = resp
  })
})

When(/^User sends a request for a file from the root folder without auth$/, function () {
  let hash = getHashFromFile('mockTest', folderData)
  cy.request({
    method: 'GET',
    url: `${basic}/file/${hash}`
  }).then((resp) => {
    user = resp
    console.log(resp)
  })
});

When(/^User sends a request for a file from the root folder with empty auth$/, function () {
  let hash = getHashFromFile('mockTest', folderData)
  headers.Authorization = 'Bearer '
  cy.request({
    headers: headers,
    method: 'GET',
    url: `${basic}/file/${hash}`
  }).then((resp) => {
    user = resp
  })
});

When(/^User sends a request for a file by incorrect hash$/, function () {
  headers.Authorization = 'Bearer ' + token
  cy.request({
    headers: headers,
    method: 'GET',
    url: `${basic}/file/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
});

When(/^User sends a request for a file without hash$/, function () {
  headers.Authorization = 'Bearer ' + token
  cy.request({
    headers: headers,
    method: 'GET',
    url: `${basic}/file/*`,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
});