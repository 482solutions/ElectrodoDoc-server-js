import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'

const URL = "http://localhost:1823/api/v1"

before(() => {
  Cypress.env('login', getLogin())
  Cypress.env('password', getPassword())
  Cypress.env('email', getLogin() + '@gmail.com')
})

const myHeaders = new Headers({
  'Authorization': `Bearer ${Cypress.env('token')}`
})

const emptyBearer = new Headers({
  'Authorization': `Bearer `
})

const incorrectBearer = new Headers({
 'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
})

When(/^User send request for upload png file$/, () => {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png').then((blob) => {

      let formData = new FormData()
      formData.append('name', 'image.png')
      formData.append('parentFolder', Cypress.env('rootFolder'))
      formData.append('file', blob)

      fetch(`${URL}/file`, {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow'
      }).then((resp) => {
        Cypress.env('respStatus', resp.status)
        return Promise.resolve(resp)
      })
      .then((resp) => {
        return resp.json()
      })
        .then((data) => {
        expect(Cypress.env('login')).to.equal(data.folder.name)
      })
    })
  })
  cy.wait(4000)
})

When(/^User send request for upload file without auth$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {

        let formData = new FormData()
        formData.append('name', '1file')
        formData.append('parentFolder', Cypress.env('rootFolder'))
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: emptyBearer,
          body: formData,
          redirect: 'follow'
        }).then((resp) => {
          Cypress.env('respStatus', resp.status)
          return Promise.resolve(resp)
        })
      })
  })
  cy.wait(4000)
})
When(/^User send request for upload file with incorrect parentFolder$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {

        let formData = new FormData()
        formData.append('name', '1file')
        formData.append('parentFolder', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((resp) => {
          Cypress.env('respStatus', resp.status)
          return Promise.resolve(resp)
        })
      })
  })
  cy.wait(4000)
})
When(/^User send request for upload file without parentFolder$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {

        let formData = new FormData()
        formData.append('name', '1file')
        formData.append('parentFolder', '')
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((resp) => {
          Cypress.env('respStatus', resp.status)
          return Promise.resolve(resp)
        })
      })
  })
  cy.wait(4000)
})
When(/^User send request for upload file with incorrect token$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {

        let formData = new FormData()
        formData.append('name', '5file')
        formData.append('parentFolder', Cypress.env('rootFolder'))
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: incorrectBearer,
          body: formData,
          redirect: 'follow'
        }).then((resp) => {
          Cypress.env('respStatus', resp.status)
          return Promise.resolve(resp)
        })
      })
  })
  cy.wait(4000)
})
When(/^User send request for upload file without file name$/, function () {
  cy.readFile('cypress/fixtures/image.png', 'base64').then((logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then((blob) => {

        let formData = new FormData()
        formData.append('name', '')
        formData.append('parentFolder', Cypress.env('rootFolder'))
        formData.append('file', blob)

        fetch(`${URL}/file`, {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow'
        }).then((resp) => {
          Cypress.env('respStatus', resp.status)
          return Promise.resolve(resp)
        })
      })
  })
  cy.wait(4000)
})

When(/^User send request for upload file without file$/, function () {
  let formData = new FormData()
  formData.append('name', 'empty')
  formData.append('parentFolder', Cypress.env('rootFolder'))
  formData.append('file', '')

  fetch(`${URL}/file`, {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow'
  }).then((resp) => {
    Cypress.env('respStatus', resp.status)
    return Promise.resolve(resp)
  })
})
