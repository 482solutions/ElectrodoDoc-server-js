import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { sha256 } from 'js-sha256'

const basic = 'api/v1/user'

const header = {
  'content-type': 'multipart/form-data',
  'accept': 'application/json'
}

let user
let token
let login
let email
let password

before('Get user data', () => {
  login = getLogin()
  password = getPassword()
  email = login + '@gmail.com'
})

When(/^I got response status 200$/, () => {
  expect(200).to.eq(user.status)
})

When(/^I got response status 401$/, () => {
  expect(401).to.eq(user.status)
})

Then(/^I got response status 422$/, () => {
  expect(422).to.eq(user.status)
});

Given(/^I send request for create new user and getting JWT token$/, () => {
  // cy.request({
  //   method: 'POST',
  //   url: basic,
  //   headers: header,
  //   form: true,
  //   body: {
  //     'login': login,
  //     'email': email,
  //     'password': password,
  //     // TODO add CSR to all steps
  //     // 'CSR': csr,
  //   },
  // }).then((resp) => {
  //   expect(resp.statusText).to.eq('Created')
  //   user = resp
  // })

  // cy.request({
  //   method: 'POST',
  //   url: basic + '/auth',
  //   headers: header,
  //   form: true,
  //   body: {
  //     'login': login,
  //     'password': password,
  //     'certificate': cy.fixture('mockCert.pem'),
  //     'private key': cy.fixture('mockPrivateKey.pem'),
  //   },
  // }).then((resp) => {
  //   let str = resp.body.toString('ascii')
  //   token = JSON.parse(str)
  // })
})

Given(/^I send request for update password$/, () => {
  cy.request({
    method: 'POST',
    url: basic + '/auth',
    headers: header,
    form: true,
    body: {
      'login': 'Albert123456',
      'password': 'Albert123456',
      'certificate': cy.fixture('mockCert.pem'),
      'private key': cy.fixture('mockPrivateKey.pem'),
    },
  }).then((resp) => {
    let str = resp.body.toString('ascii')
    token = JSON.parse(str)
  })

  header.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjE1ODg2MTc3OTcsInVzZXJfaWQiOjB9.0DlkiIHcISiadlI9StzL5LCG-FAWjsjE924Uiabb7A8' //+ token
  cy.request({
    method: 'PUT',
    url: basic,
    headers: header,
    body: {
      'oldPassword': sha256('Albert123456'),
      'newPassword': sha256('Albert123457')
    }
  }).then((resp) => {
    user = resp
    cy.log(user)
  })
})
