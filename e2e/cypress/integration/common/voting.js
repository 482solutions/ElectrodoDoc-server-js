import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile } from '../../support/commands'
const sinon = require("sinon");

let headers = {
  'content-type': 'application/json',
  'Authorization': `Bearer ${Cypress.env('token')}`,
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
  false: '',
  true: 'Some kind of description of the vote and the document itself. The importance of considering it, arguments, and edits that were made to the latest version of the document are described. Descriptions must not exceed 256 characters, including spaces and .....',
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
let time = Math.floor(new Date().getTime() / 1000.0) + 20000;

Given(/^User send request for create voting with (\d+) answers for a file "([^"]*)" and description "([^"]*)"$/,
  (answer, version, file, desc) => {;
  cy.request({
    headers: headers,
    method: 'POST',
    url: '/voting',
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
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

Given(/^User send request for create voting "([^"]*)" token for a file "([^"]*)"$/,
  (token, file) => {
  token = bearer[token]
  headers.Authorization = token
  cy.request({
    headers: headers,
    method: 'POST',
    url: '/voting',
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
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

Given(/^User send request for create voting "([^"]*)" fileHash$/,
  (fileHash) => {
  cy.request({
    headers: headers,
    method: 'POST',
    url: '/voting',
    body: {
      hash: hash[fileHash],
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

Given(/^User send request for create voting "([^"]*)" dueDate for a file "([^"]*)"$/,
  (dueDate, file) => {
  const time = {
    without: '',
  }
  cy.request({
    headers: headers,
    method: 'POST',
    url: '/voting',
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
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

Given(/^User send request for create voting dueDate "([^"]*)" timeNow for a file "([^"]*)"$/,
  (operator, file) => {
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
    url: '/voting',
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
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
When(/^User send request for re\-create a vote after the final first vote$/, () => {
  const fakeTime = sinon.useFakeTimers(new Date(time * 1000));//.getTime()
  let date = new Date(); //=> return the fake Date
  console.log(date)
  // cy.request({
  //   headers: headers,
  //   method: 'POST',
  //   url: '/voting',
  //   body: {
  //     hash: getHashFromFile(file, Cypress.env('filesInRoot')),
  //     dueDate: '',
  //     variants: variantsAnswers[2],
  //     excludedUsers: [],
  //     description: description[true],
  //   },
  //   failOnStatusCode: false,
  // }).then((resp) => {
  //   console.log(resp.body)
    fakeTime.restore();
    let date2 = new Date(); //=> will return the real time again (now)
    console.log(date2)
  // });
});
