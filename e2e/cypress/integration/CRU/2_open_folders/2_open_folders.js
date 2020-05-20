import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'
import { sha256 } from 'js-sha256'

const basic = 'api/v1'
const headers = {
  'content-type': 'application/json'
}

let user
let token
let login
let email
let password
let cert
let csr
let privateKey
let parseResp

before('Get user data', () => {
  login = getLogin() + 'OpenFolder'
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })
  privateKey = cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
    .readFile('cypress/fixtures/privateKey.pem')
    .then((text) => {
      expect(text).to.include('-----BEGIN PRIVATE KEY-----')
      expect(text).to.include('-----END PRIVATE KEY-----')
    })
})

When(/^Response status 200$/, () => {
  expect(200).to.eq(user.status)
})
When(/^Response status 201$/, () => {
  expect(201).to.eq(user.status)
})

Then(/^Response status 203$/, () => {
  expect(203).to.eq(user.status)
});

Then(/^Response status 404$/, () => {
  expect(404).to.eq(user.status)
});

//------------------------------------------------------------------------------------------

Given(/^Send request for create user$/, () => {
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
  }).then((resp) => {
    user = resp
    expect(201).to.eq(user.status)
    cert = cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert)
      .then(() => {
        cert = cy.readFile('cypress/fixtures/cert.pem').then((text) => {
          expect(text).to.include('-----BEGIN CERTIFICATE-----')
          expect(text).to.include('-----END CERTIFICATE-----')
        })
      })
  }).fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((privateKey) => {
      cy.request({
        method: 'POST',
        url: basic + '/user/auth',
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': cert,
          'privateKey': privateKey,
        },
      }).then((resp) => {
        token = resp.body.token
        user = resp
      })
    })
  })
});

When(/^The user sent a request to create a folder in the root folder with the name (.*)$/, (Names) => {
  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'POST',
    url: basic + '/folder',
    headers: headers,
    body: {
      'name': Names,
      'parentFolder':  sha256(login)
    },
  }).then((resp) => {
    parseResp = JSON.parse(resp.body.folder.folders)
    user = resp
  })
});

Given(/^The user sent a request to receive a folder in the root folder with the name F$/, () => {
  expect('F').to.eq(parseResp[0].name)

  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'GET',
    url: basic + `/folder/${parseResp[0].hash}`,
    headers: headers,
  }).then((resp) => {
    user = resp
  })
});
Given(/^The user sent a request to receive a folder in the root folder with the name Folder-1$/, () => {
  expect('Folder-1').to.eq(parseResp[1].name)

  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'GET',
    url: basic + `/folder/${parseResp[1].hash}`,
    headers: headers,
  }).then((resp) => {
    user = resp
  })
});
Given(/^The user sent a request to receive a folder in the root folder with the name folder2$/, () => {
  expect('folder2').to.eq(parseResp[2].name)

  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'GET',
    url: basic + `/folder/${parseResp[2].hash}`,
    headers: headers,
  }).then((resp) => {
    user = resp
  })
});
Given(/^The user sent a request to receive a folder in the root folder with the name FOLDER 3$/, () => {
  expect('FOLDER 3').to.eq(parseResp[3].name)

  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'GET',
    url: basic + `/folder/${parseResp[3].hash}`,
    headers: headers,
  }).then((resp) => {
    user = resp
  })
});
Given(/^The user sent a request to receive a folder in the root folder with the name Folder12345678901234$/, () => {
  expect('Folder12345678901234').to.eq(parseResp[4].name)

  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'GET',
    url: basic + `/folder/${parseResp[4].hash}`,
    headers: headers,
  }).then((resp) => {
    user = resp
  })
});
Given(/^The user sent a request to receive a folder in the root folder with the name Папка$/, () => {
  expect('Папка').to.eq(parseResp[5].name)

  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'GET',
    url: basic + `/folder/${parseResp[5].hash}`,
    headers: headers,
  }).then((resp) => {
    user = resp
  })
});
Given(/^The user sent a request to receive a folder in the root folder with the name 資料 夾$/, () => {
  expect('資料夾').to.eq(parseResp[6].name)

  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'GET',
    url: basic + `/folder/${parseResp[6].hash}`,
    headers: headers,
  }).then((resp) => {
    user = resp
  })
});

Given(/^The user sends a request for a folder without authorization$/, () => {
  expect('F').to.eq(parseResp[0].name)

  headers.Authorization = 'Bearer ' + ' '
  cy.request({
    method: 'GET',
    url: basic + `/folder/${parseResp[0].hash}`,
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
    console.log(resp.body)
  })
})
Given(/^The user sends a request for a folder with incorrect hash$/, () => {

  headers.Authorization = 'Bearer ' + token
  cy.request({
    method: 'GET',
    url: basic + '/folder/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    headers: headers,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
});
