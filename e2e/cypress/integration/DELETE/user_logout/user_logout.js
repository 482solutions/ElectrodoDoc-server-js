import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'

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

When(/^I got response status 201$/, () => {
  expect(201).to.eq(user.status)
})

Then(/^I got response status 203$/, () => {
  expect(203).to.eq(user.status)
});

Given(/^I send request for create new user and getting JWT token$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: header,
    form: true,
    body: {
      'login': login,
      'email': email,
      'password': password,
      // TODO add CSR to all steps
      // 'CSR': csr,
    },
  }).then((resp) => {
    expect(resp.statusText).to.eq('Created')
    user = resp
  })

  cy.request({
    method: 'POST',
    url: basic + '/auth',
    headers: header,
    form: true,
    body: {
      'login': login,
      'password': password,
      'certificate': cy.fixture('mockCert.pem'),
      'private key': cy.fixture('mockPrivateKey.pem'),
    },
  }).then((resp) => {
    let str = resp.body.toString('ascii')
    token = JSON.parse(str)
  })
})

Given(/^I send request for logout$/, () => {
  header.Authorization = 'Bearer ' + token
  cy.request({
    method: 'DELETE',
    url: basic + '/logout',
    headers: header
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for logout without token$/, () => {
  cy.request({
    method: 'DELETE',
    url: basic + '/logout',
    headers: header,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for logout with incorrect token$/, function () {
  header.Authorization = 'Bearer ' + 'incorrectToken'
  cy.request({
    method: 'DELETE',
    url: basic + '/logout',
    headers: header,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})
