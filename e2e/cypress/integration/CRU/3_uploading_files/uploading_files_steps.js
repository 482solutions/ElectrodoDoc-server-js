import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const URL = "http://localhost:1823/api/v1"

const headers = { 'content-type': 'application/json' }

let user, token, login, email, password, parentFolder, csr, folderData

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

/*
  Expect response status:
 */

When(/^Response status 200 upload$/, () => {
  expect(200).to.eq(user.status)
})

Then(/^Response status 203 upload$/, () => {
  expect(203).to.eq(user.status)
})

Then(/^Response status 404 upload$/, () => {
  expect(404).to.eq(user.status)
})

Then(/^Response status 422 upload$/, () => {
  expect(422).to.eq(user.status)
})

/*
  Implementation of the steps from **.feature
 */
Given(/^Send request for create user for upload$/, () => {
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: `${URL}/user`,
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
        url: `${URL}/user/auth`,
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
})

When(/^User send request for upload png file$/, () => {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png').then((blob) => {
      const myHeaders = new Headers()
      myHeaders.set('Authorization', `Bearer ${token}`)

      let formData = new FormData()
      formData.append('name', 'image.png')
      formData.append('parentFolder', parentFolder)
      formData.append('file', blob)

      fetch(`${URL}/file`, {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow'
      }).then((response) => {

        user = response
        return Promise.resolve(response)
      })
      .then((response) => {

        return response.json()
      }).then((data) => {
        console.log(data)
        expect(login).to.equal(data.folder.name)
      })
    })
  })
  cy.wait(2000)
})

When(/^User send request for upload txt file$/, function () {
  cy.readFile('cypress/fixtures/mockTest.txt').then((str) => {
    let blob = new Blob([str], { type: 'text/plain' })
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`
    })
    let formData = new FormData()
    formData.append('name', 'mockTest')
    formData.append('parentFolder', parentFolder)
    formData.append('file', blob)

    fetch(`${URL}/file`, {
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

When(/^User send request for upload file without auth$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {
        const myHeaders = new Headers()
        myHeaders.set('Authorization', `Bearer `)

        let formData = new FormData()
        formData.append('name', '1file')
        formData.append('parentFolder', parentFolder)
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((response) => {
          user = response
          return Promise.resolve(response)
        })
      })
  })
  cy.wait(2000)
})
When(/^User send request for upload file with incorrect parentFolder$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {
        const myHeaders = new Headers()
        myHeaders.set('Authorization', `Bearer ${token}`)

        let formData = new FormData()
        formData.append('name', '1file')
        formData.append('parentFolder', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((response) => {
          user = response
          return Promise.resolve(response)
        })
      })
  })
  cy.wait(2000)
})
When(/^User send request for upload file without parentFolder$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {
        const myHeaders = new Headers()
        myHeaders.set('Authorization', `Bearer ${token}`)

        let formData = new FormData()
        formData.append('name', '1file')
        formData.append('parentFolder', '')
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((response) => {
          user = response
          return Promise.resolve(response)
        })
      })
  })
  cy.wait(2000)
})
When(/^User send request for upload file with incorrect token$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {
        const myHeaders = new Headers()
        myHeaders.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`)

        let formData = new FormData()
        formData.append('name', '5file')
        formData.append('parentFolder', parentFolder)
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((response) => {
          user = response
          return Promise.resolve(response)
        })
      })
  })
  cy.wait(2000)
})
When(/^User send request for upload file without file name$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {
        const myHeaders = new Headers()
        myHeaders.set('Authorization', `Bearer ${token}`)

        let formData = new FormData()
        formData.append('name', '')
        formData.append('parentFolder', parentFolder)
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((response) => {
          user = response
          return Promise.resolve(response)
        })
      })
  })
  cy.wait(2000)
})

When(/^User send request for upload file without file$/, function () {
  const myHeaders = new Headers()
  myHeaders.set('Authorization', `Bearer ${token}`)

  let formData = new FormData()
  formData.append('name', 'empty')
  formData.append('parentFolder', parentFolder)
  formData.append('file', '')

  fetch(`${URL}/file`, {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow'
  }).then((response) => {
    user = response
    return Promise.resolve(response)
  })
})
