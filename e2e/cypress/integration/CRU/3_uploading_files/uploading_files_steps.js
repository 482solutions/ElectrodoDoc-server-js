import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'

const URL = 'http://localhost:1823/api/v1'

const emptyBearer = new Headers({
  'Authorization': `Bearer `
})

const incorrectBearer = new Headers({
  'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
})

When(/^User send request for upload png file$/, () => {
  let token = Cypress.env('token')
  cy.readFile('cypress/fixtures/image.png', 'base64').then(async (logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png').then(async (blob) => {

      let formData = new FormData()
      formData.append('name', 'image.png')
      formData.append('parentFolder', Cypress.env('rootFolder'))
      formData.append('file', blob)

      await fetch(`${URL}/file`, {
        method: 'POST',
        headers: new Headers({
          'Authorization': `Bearer ${token}`
        }),
        body: formData,
        redirect: 'follow'
      }).then((response) => {
        Cypress.env('respStatus', response.status)
        return response.json();
      }).then((result) => {
        console.log(result)
        Cypress.env('filesInRoot', result.folder.files)
        // expect(Cypress.env('login')).to.equal(result.folder.folderName)
        });
    })
  }).as('Send png')
  cy.wait(6000)
})

When(/^User send request for upload file without auth$/, () => {
  cy.readFile('cypress/fixtures/image.png', 'base64').then(async (logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then(async (blob) => {

        let formData = new FormData()
        formData.append('name', '1file')
        formData.append('parentFolder', Cypress.env('rootFolder'))
        formData.append('file', blob)

        const resp = await fetch(`${URL}/file`, {
          method: 'POST',
          headers: emptyBearer,
          body: formData,
          redirect: 'follow'
        })

        if (expect(203).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
  })
  cy.wait(5000)
})

When(/^User send request for upload file with incorrect parentFolder$/, () => {
  let token = Cypress.env('token')
  cy.readFile('cypress/fixtures/image.png', 'base64').then(async (logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then(async (blob) => {

        let formData = new FormData()
        formData.append('name', '1file')
        formData.append('parentFolder',
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        formData.append('file', blob)

        const resp = await fetch(`${URL}/file`, {
          method: 'POST',
          headers: new Headers({
            'Authorization': `Bearer ${token}`
          }),
          body: formData,
          redirect: 'follow'
        })

        if (expect(404).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
  })
  cy.wait(5000)
})

When(/^User send request for upload file without parentFolder$/, () => {
  let token = Cypress.env('token')
  cy.readFile('cypress/fixtures/image.png', 'base64').then(async (logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then(async (blob) => {

        let formData = new FormData()
        formData.append('name', '1file')
        formData.append('parentFolder', '')
        formData.append('file', blob)

        const resp = await fetch(`${URL}/file`, {
          method: 'POST',
          headers: await new Headers({
            'Authorization': `Bearer ${token}`
          }),
          body: formData,
          redirect: 'follow'
        })

        if (expect(422).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
  })
  cy.wait(5000)
})

When(/^User send request for upload file with incorrect token$/, () => {
  cy.readFile('cypress/fixtures/image.png', 'base64').then(async (logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then(async (blob) => {

        let formData = new FormData()
        formData.append('name', '5file')
        formData.append('parentFolder', Cypress.env('rootFolder'))
        formData.append('file', blob)

        const resp = await fetch(`${URL}/file`, {
          method: 'POST',
          headers: await incorrectBearer,
          body: formData,
          redirect: 'follow'
        })

        if (expect(203).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
  })
  cy.wait(5000)
})
When(/^User send request for upload file without file name$/, () => {
  let token = Cypress.env('token')
  cy.readFile('cypress/fixtures/image.png', 'base64').then(async (logo) => {
    Cypress.Blob.base64StringToBlob(logo, 'image/png')
      .then(async (blob) => {

        let formData = new FormData()
        formData.append('name', '')
        formData.append('parentFolder', Cypress.env('rootFolder'))
        formData.append('file', blob)

        const resp = await fetch(`${URL}/file`, {
          method: 'POST',
          headers: await new Headers({
            'Authorization': `Bearer ${token}`
          }),
          body: formData,
          redirect: 'follow'
        })

        if (expect(422).to.eq(resp.status)) {
          Cypress.env('respStatus', resp.status)
        }
      })
  })
  cy.wait(5000)
})

When(/^User send request for upload file without file$/, async () => {
  let formData = new FormData()
  formData.append('name', 'empty')
  formData.append('parentFolder', Cypress.env('rootFolder'))
  formData.append('file', '')

  const resp = await fetch(`${URL}/file`, {
    method: 'POST',
    headers: await new Headers({
      'Authorization': `Bearer ${incorrectBearer}`
    }),
    body: formData,
    redirect: 'follow'
  })

  if (expect(400).to.eq(resp.status)) {
    Cypress.env('respStatus', resp.status)
  }
  cy.wait(4000)
})
