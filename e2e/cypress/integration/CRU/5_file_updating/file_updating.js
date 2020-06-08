import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const basic = 'api/v1'
const headers = {
  'content-type': 'application/json'
}

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

When(/^Response status 200 updating$/, () => {
  expect(200).to.eq(user.status)
})

Then(/^Response status 203 updating$/, () => {
  expect(203).to.eq(user.status)
})

Then(/^Response status 404 updating$/, () => {
  expect(404).to.eq(user.status)
})

Then(/^Response status 422 updating$/, () => {
  expect(422).to.eq(user.status)
})

/*
  Implementation of the steps from **.feature
 */

Given(/^Send request for create user for updating file$/, () => {
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
        user = resp
        parentFolder = resp.body.folder
      })
    })
  })
})

Given(/^The user send request for upload file "([^"]*)"$/, (fullName) => {
  cy.readFile(`cypress/fixtures/${fullName}`).then((str) => {
    let blob = new Blob([str], { type: 'text/plain' })
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`
    })
    let formData = new FormData()
    formData.append('name', fullName)
    formData.append('parentFolder', parentFolder)
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
      // expect(login).to.equal(data.folder.name)
      folderData = data
      console.log(data)
    })
  }).as('Send txt file').wait(2000)
})

const getFileHash = (nameOfFile) => {
  let files = JSON.parse(folderData.folder.files)
  for (let key in files) {
    if (nameOfFile === files[key].name) {
      return files[key].hash
    }
  }
}

When(/^The user send request for updating file "([^"]*)"$/, (fileName) => {
  let hashFile = getFileHash(fileName)
  const text = 'Good morning!'
  cy.writeFile(`cypress/fixtures/${fileName}`, text).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(text)

    let blob = new Blob([str], {type: 'text/plain'})
    const myHeaders = new Headers();
    myHeaders.set("Authorization", `Bearer ${user.body.token}`);

    let formData = new FormData()
    formData.append('hash', hashFile)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'PUT',
      headers: myHeaders,
      body: formData,
    }).then((response) => {
      console.log(response.status)
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
      console.log(data)
    })
  }).as('Update txt file').wait(2000)
});

When(/^The user send request for updating file "([^"]*)" and bearer is empty$/, function (fileName) {
  let hashFile = getFileHash(fileName)
  const text = 'Good morning!'
  cy.writeFile(`cypress/fixtures/${fileName}`, text).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(text)

    let blob = new Blob([str], {type: 'text/plain'})
    const myHeaders = new Headers();
    myHeaders.set("Authorization", `Bearer `);

    let formData = new FormData()
    formData.append('hash', hashFile)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'PUT',
      headers: myHeaders,
      body: formData,
    }).then((response) => {
      console.log(response.status)
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
      console.log(data)
    })
  }).as('Update txt file').wait(2000)
});

When(/^The user send request for updating file "([^"]*)" if the file is not exist$/, (fileName) => {
  const text = 'Good night!'
  cy.writeFile(`cypress/fixtures/${fileName}`, text).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(text)

    let blob = new Blob([str], {type: 'text/plain'})
    const myHeaders = new Headers();
    myHeaders.set("Authorization", `Bearer ${user.body.token}`);

    let formData = new FormData()
    formData.append('hash', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'PUT',
      headers: myHeaders,
      body: formData,
    }).then((response) => {
      console.log(response.status)
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
      console.log(data)
    })
  }).as('Update txt file').wait(2000)
});

When(/^The user send request for updating file "([^"]*)" if the file is invalid$/, (fileName) => {
  const text = 'Good night!'
  cy.writeFile(`cypress/fixtures/${fileName}`, text).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(text)

    let blob = new Blob([str], {type: 'text/plain'})
    const myHeaders = new Headers();
    myHeaders.set("Authorization", `Bearer ${user.body.token}`);

    let formData = new FormData()
    formData.append('hash', 'hkjvjhv')
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'PUT',
      headers: myHeaders,
      body: formData,
    }).then((response) => {
      console.log(response.status)
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
      console.log(data)
    })
  }).as('Update txt file').wait(2000)
});

When(/^The user send request for updating file "([^"]*)" with incorrect bearer$/, (fileName) => {
  const text = 'Good night!'
  let hashFile = getFileHash(fileName)
  cy.writeFile(`cypress/fixtures/${fileName}`, text).as('Write text to the file')
  cy.readFile(`cypress/fixtures/${fileName}`).then((str) => {

    expect(str).to.equal(text)

    let blob = new Blob([str], {type: 'text/plain'})
    const myHeaders = new Headers();
    myHeaders.set("Authorization", `Bearer jhbhblk`);

    let formData = new FormData()
    formData.append('hash', hashFile)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'PUT',
      headers: myHeaders,
      body: formData.set(hash, blob, fileName),
    }).then((response) => {
      console.log(response.status)
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
      console.log(data)
    })
  }).as('Update txt file').wait(2000)
});