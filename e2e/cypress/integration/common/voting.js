import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile, getLogin } from '../../support/commands'

let headers = {
  'content-type': 'application/json',
  'Authorization': `Bearer ${Cypress.env('token')}`,
};
const logins = {
  User1: `Bearer ${Cypress.env('token')}`,
  User2: `Bearer ${Cypress.env('token_2')}`,
  User3: `Bearer ${Cypress.env('token_3')}`,
};
const variantsAnswers = {
  0: [],
  1: ['Yes'],
  2: ['Yes', 'No'],
  3: ['Yes', 'No', 'Possibly'],
  4: ['Yes', 'No', 'Possibly', 'Not sure'],
  5: ['Yes', 'No', 'Possibly', 'Not sure', 'Return to one of previous versions'],
  6: ['Yes', 'No', 'Possibly', 'Not sure', 'Return to one of previous versions', 'I don\'t know'],
  7: ['Yes', 'No', 'Possibly', 'Not sure', 'Return to one of previous versions', 'I don\'t know', 'Hmmm...']
};
const description = {
  true: 'Some kind of description of the vote and the document itself. The importance of considering it, arguments, and edits that were made to the latest version of the document are described. Descriptions must not exceed 256 characters, including spaces and .....',
  false: '',
  big: 'Some kind of description of the vote and the document itself. The importance of considering it, arguments, and edits that were made to the latest version of the document are described. Descriptions must not exceed 256 characters, including spaces and ......',
};
const bearer = {
  without: 'Bearer ',
  incorrect: 'Bearer nfrl4lkn43jnj5k345njhfjvdnf993898463g4gvgcgvfsdfvcvvreferfowierUVEkjbj',
};
const hash = {
  without: '',
  incorrect: 'incorrectHashincorrectHashincorrectHashincorrectHashincorrectHas',
};
let time = Math.floor(new Date().getTime() / 1000.0) + 200000;

Given(/^User send request for create voting with (\d+) answers for a (\d+) version of the file "([^"]*)" and description "([^"]*)"$/, (answer, version, file, desc) => {
  const cid = {
    0: null,
    1: Cypress.env('versions')[0].cid,
    2: Cypress.env('versions')[1].cid,
  };
  cy.request({
    headers: headers,
    method: 'POST',
    url: ``,
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
      cid: version[cid],
      dueDate: '',
      variants: variantsAnswers[answer],
      excludedUsers: [],
      description: description[desc],
    },
    failOnStatusCode: false,
  }).then((resp) => {
    console.log(resp.body)
  })
})

Given(/^User send request for create voting "([^"]*)" token for a file "([^"]*)"$/, (token, file) => {
  token = bearer[token]
  headers.Authorization = token
  cy.request({
    headers: headers,
    method: 'POST',
    url: ``,
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
      cid: Cypress.env('versions')[1].cid,
      dueDate: '',
      variants: variantsAnswers[2],
      excludedUsers: [],
      description: description[true],
    },
    failOnStatusCode: false,
  }).then((resp) => {
    console.log(resp.body)
  })
})

Given(/^User send request for create voting "([^"]*)" fileHash$/, (fileHash) => {
  cy.request({
    headers: headers,
    method: 'POST',
    url: ``,
    body: {
      hash: hash[fileHash],
      cid: Cypress.env('versions')[1].cid,
      dueDate: '',
      variants: variantsAnswers[2],
      excludedUsers: [],
      description: description[true],
    },
    failOnStatusCode: false,
  }).then((resp) => {
    console.log(resp.body)
  })
})

Given(/^User send request for create voting "([^"]*)" dueDate for a file "([^"]*)"$/, (dueDate, file) => {
  const time = {
    without: '',
  }
  cy.request({
    headers: headers,
    method: 'POST',
    url: ``,
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
      cid: Cypress.env('versions')[1].cid,
      dueDate: time[dueDate],
      variants: variantsAnswers[2],
      excludedUsers: [],
      description: description[true],
    },
    failOnStatusCode: false,
  }).then((resp) => {
      console.log(resp.body)
    });
})

Given(/^User send request for create voting dueDate "([^"]*)" timeNow for a file "([^"]*)"$/, (operator, file) => {
  switch (operator) {
    case '<':
      time = Math.floor(new Date().getTime()/1000.0) - 200000;
      break;
    case '==':
      time = Math.floor(new Date().getTime()/1000.0)
      break;
  }
  // UTC time:
  // const t = new Date(time * 1000);
  // console.log(t.toLocaleString());

  cy.request({
    headers: headers,
    method: 'POST',
    url: ``,
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
      cid: Cypress.env('versions')[1].cid,
      dueDate: time,
      variants: variantsAnswers[2],
      excludedUsers: [],
      description: description[true],
    },
    failOnStatusCode: false,
  }).then((resp) => {
      console.log(resp.body)
    });
})

Given(/^User send request for create voting for file "([^"]*)" without "([^"]*)"$/, (file, user) => {
  user === 'everyone' ? user = [Cypress.env('login_2'), Cypress.env('login_3')] : user = [Cypress.env('login_2')]
  console.log(user)
  cy.request({
    headers: headers,
    method: 'POST',
    url: ``,
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
      cid: Cypress.env('versions')[1].cid,
      dueDate: time,
      variants: variantsAnswers[2],
      excludedUsers: user,
      description: description[true],
    },
    failOnStatusCode: false,
  }).then((resp) => {
    console.log(resp.body)
  })
});

When(/^"([^"]*)" send request for view an open vote$/,  (user) => {
  headers.Authorization = logins[user]
  cy.request({
    headers: headers,
    method: 'GET',
    url: ``,
    failOnStatusCode: false,
  }).then((resp) => {
    console.log(resp.body)
  })
});
