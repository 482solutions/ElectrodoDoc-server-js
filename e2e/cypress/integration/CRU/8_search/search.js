import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'
import { sha256 } from 'js-sha256'

const basic = 'http://localhost:1823/api/v1'

const headers = {
  'content-type': 'application/json'
}

let user, token, login, email, password, cert, csr, privateKey, folderData

// let getHashFromFile = (fileName, resp) => {
//   let files = JSON.parse(resp.body.files)
//   for (let key in files) {
//     if (fileName === files[key].name) {
//       return files[key].hash
//     }
//   }
// }

let getHashFromFolder = (folderName, resp) => {
  let foldersN = JSON.parse(resp.body.folder.folders)
  for (let key in foldersN) {
    if ('testFolder' === foldersN[key].name) {
      return foldersN[key].hash
      //TODO add CID
    }
  }
}

before(() => {
  login = getLogin() + 'JWT'
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })
  privateKey = cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
})

/*
  Expect response status:
 */
When(/^Response status 200 search$/, () => {
  expect(200).to.eq(user.status)
})

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

When(/^User send request for create folder "([^"]*)" in root folder$/, (folderName) => {
  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'POST',
    url: basic + '/folder',
    headers: headers,
    body: {
      'name': folderName,
      'parentFolder': sha256(login)
    },
  }).then((resp) => {
    user = resp
  })
})

When(/^The user send request for upload new file to testFolder with name "([^"]*)"$/, (fileName) => {
  let testFolderHash = getHashFromFolder('testFolder', user)

  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {
        const myHeaders = new Headers()
        myHeaders.set('Authorization', `Bearer ${token}`)

        let formData = new FormData()
        formData.append('name', fileName)
        formData.append('parentFolder', testFolderHash)
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
          folderData = data
          expect(testFolderHash).to.equal(folderData.folder.hash)
        })
      })
  })
  cy.wait(2000)
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