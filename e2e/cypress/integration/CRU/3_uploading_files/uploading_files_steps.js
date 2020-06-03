import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const basic = 'api/v1'
const headers = {
  'content-type': 'application/json'
}

let user, token, login, email, password, cert, csr, privateKey

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

When(/^User send request for upload png file$/, () => {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {
        const myHeaders = new Headers()
        myHeaders.set('Authorization', `Bearer ${token}`)

        let formData = new FormData()
        formData.append('name', '1file')
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
        })
      })
  })
  cy.wait(2000)
})
When(/^User send request for upload file without auth$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {
        const myHeaders = new Headers()
        myHeaders.set('Authorization', `Bearer `)

        let formData = new FormData()
        formData.append('name', '1file')
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

        fetch(`${basic}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((response) => {
          console.log(response.status)
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

        fetch(`${basic}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((response) => {
          console.log(response.status)
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
        myHeaders.set('Authorization', `Bearer aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`)

        let formData = new FormData()
        formData.append('name', '5file')
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
  formData.append('parentFolder', user.body.folder)
  formData.append('file', '')

  fetch(`${basic}/file`, {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow'
  }).then((response) => {
    console.log(response.status)
    user = response
    return Promise.resolve(response)
  })
});