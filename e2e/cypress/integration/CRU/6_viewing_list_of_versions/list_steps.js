import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getLogin, getPassword } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const basic = 'http://localhost:1823/api/v1'
const headers = { 'content-type': 'application/json' }

let user, token, login, email, password, parentFolder, csr, folderData, data

before(() => {
  login = getLogin() + 'JWT'
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })

  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
    .readFile('cypress/fixtures/privateKey.pem')
    .then((text) => {
      expect(text).to.include('-----BEGIN PRIVATE KEY-----')
      expect(text).to.include('-----END PRIVATE KEY-----')
    })
})

let getHashFromFile = (fileName, files) => {
  for (let key in files) {
    if (fileName === files[key].name) {
      return files[key].hash
    }
  }
}

const textBefore = 'Good night!'
const textAfter = 'Good morning!'

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
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: `${basic}/user`,
      headers: headers,
      body: {
        'login': login,
        'email': email,
        'password': password,
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      user = resp
      cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert)
        .then(() => {
          cy.readFile('cypress/fixtures/cert.pem').then((text) => {
            expect(text).to.include('-----BEGIN CERTIFICATE-----')
            expect(text).to.include('-----END CERTIFICATE-----')
          })
        })
    })
  }).fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: `${basic}/user/auth`,
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': cert,
          'privateKey': key,
        },
      }).then((resp) => {
        token = resp.body.token
        user = resp
        parentFolder = resp.body.folder
      })
    })
  })
});

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
      user = response
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
    })
  }).as('Send txt').wait(2000)
});

Given(/^Change txt file$/, () => {
  cy.writeFile('cypress/fixtures/TestUpload.txt', textAfter)
});

Given(/^The user send request for updating txt file$/,  () => {
  cy.readFile('cypress/fixtures/TestUpload.txt').then((str) => {
    let blob = new Blob([str], { type: 'text/plain' })
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`
    })
    let formData = new FormData()
    formData.append('name', 'TestUpload.txt')
    formData.append('parentFolder', parentFolder)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    }).then((response) => {
      user = response
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
    })
  }).as('Send txt').wait(5000)
})

When(/^Send request for list of the previous versions of txt file$/, () => {
  let files = JSON.parse(folderData.folder.files)
  let hashFile = getHashFromFile('TestUpload.txt', files)

  cy.writeFile(`cypress/fixtures/TestUpload.txt`, textAfter).as('Write text to the file')
  cy.readFile(`cypress/fixtures/TestUpload.txt`).then((str) => {

    expect(str).to.equal(textAfter)

    let blob = new Blob([str], {type: 'text/plain'})
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`
    })

    let formData = new FormData()
    formData.append('hash', hashFile)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'PUT',
      headers: myHeaders,
      body: formData,
    }).then((response) => {
      user = response
      return Promise.resolve(user)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      data =
      // let files = JSON.parse(data.file.files)
      // expect(files[0].versions[0].cid).to.not.equal(files[1].versions[1].cid)
      expect(JSON.parse(data.file.files).length).to.equal(2)

    })
  }).as('Update txt file').wait(5000)
});

Then(/^Response should contain 2 different cid$/, function () {
  let files = JSON.parse(data.file.files)
  expect(files[0].versions[0].cid).to.not.equal(files[1].versions[1].cid)
});

When(/^The user send request for list of previous version with incorrect bearer$/, () => {
  const hash = getFileHash('TestUpload')
  headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
  cy.request({
    method: 'GET',
    headers: headers,
    url: `${basic}/versions/${hash}`,
    failOnStatusCode: false
  }).then((resp) => {
    // user = resp
    console.log(resp)
  })
});

When(/^The user send request for list if bearer is empty$/, function () {
  const hash = getFileHash('TestUpload')
  headers.Authorization = `Bearer `
  cy.request({
    method: 'GET',
    headers: headers,
    url: `${basic}/versions/${hash}`,
    failOnStatusCode: false
  }).then((resp) => {
    // user = resp
    console.log(resp)
  })
});

When(/^The user send request for get list with incorrect hash$/, function () {
  const hash = getFileHash('Test')
  headers.Authorization = `Bearer ${token}`
  cy.request({
    method: 'GET',
    headers: headers,
    url: `${basic}/versions/${hash}`,
    failOnStatusCode: false
  }).then((resp) => {
    // user = resp
    console.log(resp)
  })
});

after(() => {
  cy.writeFile('cypress/fixtures/TestUpload.txt', textBefore)
})