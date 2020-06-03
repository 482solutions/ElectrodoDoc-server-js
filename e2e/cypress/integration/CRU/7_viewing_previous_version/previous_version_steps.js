import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const basic = 'api/v1'
const headers = {
  'content-type': 'application/json'
}

let user, token, login, email, password, cert, csr, privateKey, folderData

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

When(/^Response status 200 previous version$/, () => {
  expect(200).to.eq(user.status)
})

Then(/^Response status 203 previous version$/, () => {
  expect(203).to.eq(user.status)
})

Then(/^Response status 404 previous version$/, () => {
  expect(404).to.eq(user.status)
})

/*
  Implementation of the steps from **.feature
 */
