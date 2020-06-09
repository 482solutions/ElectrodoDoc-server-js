import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'
import { sha256 } from 'js-sha256'

const basic = 'http://localhost:1823/api/v1'

const headers = {
  'content-type': 'application/json'
}

let user, token, login, email, password, parentFolder, csr, folderData, createdFolder

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

let getHashFromFolder = (folderName, folders) => {
  for (let key in folders) {
    if (folderName === folders[key].name) {
      return folders[key].hash
    }
  }
}

/*
  Expect response status:
 */
// When(/^Response status 200$/, () => {
//   expect(200).to.eq(Cypress.env('respStatus'))
// })

Then(/^Response status 203 search$/, () => {
  expect(203).to.eq(user.status)
})

Then(/^Response status 404 search$/, () => {
  expect(404).to.eq(user.status)
})

/*
  Implementation of the steps from **.feature
 */

Given(/^Send request for create user for search$/, () => {
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
      expect(resp.status).to.equal(201)
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
        parentFolder = resp.body.folder
        // Cypress.env('respStatus', resp.status)
        expect(resp.status).to.equal(200)
      })
    })
  })
})

When(/^User send request for create folder "([^"]*)" in root folder$/, (folderName) => {
  headers.Authorization = `Bearer ${token}`
  cy.request({
    method: 'POST',
    url: basic + '/folder',
    headers: headers,
    body: {
      'name': folderName,
      'parentFolder': parentFolder
    },
  }).then((createdFolder) => {
    expect(createdFolder.status).to.equal(201)
    console.log(createdFolder.body)
    //todo: вытащить хеш папки
    return Promise.resolve(createdFolder)
  })
})

When(/^The user send request for upload new file to testFolder with name "([^"]*)"$/, (fileName) => {
  // console.log(createdFolder)
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    let blob = new Blob([str], { type: 'text/plain' })
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`
    })
    let formData = new FormData()
    formData.append('name', fileName)
    formData.append('parentFolder', createdFolder)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    }).then((response) => {
      expect(response.status).to.equal(201)
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
    })
  }).as('Send txt').wait(5000)
})

When(/^The user send request for search file by name from list (.*)$/, (fileName) => {
  let name = fileName
  headers.Authorization = `Bearer ${token}`
  cy.request({
    method: 'GET',
    headers: headers,
    url: `${basic}/search/${name}`
  }).then((resp) => {
    user = resp
    let countFiles = resp.body.files.length - 1

    for (let key in resp.body.files) {
      if (name === resp.body.files[key].name) {
        /*
        Hash of the created folder must match the hash of the folder into which the file is loaded.
         */
        expect(folderData.folder.hash).to.equal(resp.body.files[countFiles].parenthash)
        return resp.body.files[key].parenthash
      }
    }
    expect('1file.png').to.equal(resp.body.files[countFiles].name)
  })
})

When(/^The user send request for search file by invalid name from list (.*)$/, (nameToUpper) => {
  let name = nameToUpper
  headers.Authorization = `Bearer ${token}`
  cy.request({
    failOnStatusCode: false,
    method: 'GET',
    headers: headers,
    url: `${basic}/search/${name}`
  }).then((resp) => {
    user = resp
  })
})

When(/^Send request for for search file without auth$/, () => {
  headers.Authorization = `Bearer `
  cy.request({
    failOnStatusCode: false,
    method: 'GET',
    headers: headers,
    url: `${basic}/search/1file`
  }).then((resp) => {
    user = resp
  })
})

When(/^Send request for for search file empty auth$/, () => {
  headers.Authorization = ``
  cy.request({
    failOnStatusCode: false,
    method: 'GET',
    headers: headers,
    url: `${basic}/search/1file`
  }).then((resp) => {
    user = resp
  })
})