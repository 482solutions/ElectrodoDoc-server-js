import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getHashFromFile, getVoteOfUser, getVoting } from '../../support/commands'

const sinon = require('sinon')

let headers = {
  'content-type': 'application/json',
}
const variantsAnswers = {
  0: [],
  1: ['Yes'],
  2: ['Yes', 'No'],
  3: ['Yes', 'No', 'Possibly'],
  4: ['Yes', 'No', 'Possibly', 'Not sure'],
  5: ['Yes', 'No', 'Possibly', 'Not sure', 'Return to one of previous versions'],
  6: ['Yes', 'No', 'Possibly', 'Not sure', 'Return to one of previous versions', 'I don\'t know'],
  7: ['Yes', 'No', 'Possibly', 'Not sure', 'Return to one of previous versions', 'I don\'t know', 'Hmmm...']
}
const description = {
  false: '',
  true: 'Some kind of description of the vote and the document itself. The importance of considering it, arguments, and edits that were made to the latest version of the document are described. Descriptions must not exceed 256 characters, including spaces and .....',
  big: 'Some kind of description of the vote and the document itself. The importance of considering it, arguments, and edits that were made to the latest version of the document are described. Descriptions must not exceed 256 characters, including spaces and ......',
}
const bearer = {
  without: 'Bearer ',
  incorrect: 'Bearer nfrl4lkn43jnj5k345njhfjvdnf993898463g4gvgcgvfsdfvcvvreferfowierUVEkjbj',
}
const hash = {
  without: '',
  incorrect: 'incorrectHashincorrectHashincorrectHashincorrectHashincorrectHas',
}
let time = Math.floor(new Date().getTime() / 1000.0) + 200000

Given(/^User send request for create voting with (\d+) answers for a file "([^"]*)" and description "([^"]*)"$/,
  (answer, file, desc) => {
    const fileHash = getHashFromFile(file, Cypress.env('filesInRoot'))
    headers.Authorization = `Bearer ${Cypress.env('token')}`
    cy.request({
      headers: headers,
      method: 'POST',
      url: '/voting',
      body: {
        hash: fileHash,
        dueDate: time.toString(),
        variants: variantsAnswers[answer],
        excludedUsers: [],
        description: description[desc],
      },
      failOnStatusCode: false,
    }).then((resp) => {
        expect(resp.body).to.not.have.property('stack');
        Cypress.env('respBody', resp.body)
        Cypress.env('respStatus', resp.status)

        if (resp.status === 201) {
          expect(resp.body).to.not.have.property('message');

          let vote = getVoting(file, resp.body.response)
          expect(vote.description).to.eq(description[desc])
          expect(vote.dueDate).to.eq(time.toString())
          expect(vote.votingName).to.eq(file)
          expect(vote.votingHash).to.not.eq(fileHash)

          Cypress.env('votes', resp.body.response)
          Cypress.env('voters', vote.voters)
          Cypress.env('votingHash', vote.votingHash)
        }
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
        dueDate: time.toString(),
        variants: variantsAnswers[2],
        excludedUsers: [],
        description: description[true],
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.body).to.not.have.property('stack');
      Cypress.env('respStatus', resp.status)
      Cypress.env('respBody', resp.body)
    })
  })

Given(/^User send request for create voting (.*) fileHash$/,
  (fileHash) => {
    headers.Authorization = `Bearer ${Cypress.env('token')}`
    cy.request({
      headers: headers,
      method: 'POST',
      url: '/voting',
      body: {
        hash: hash[fileHash],
        dueDate: time.toString(),
        variants: variantsAnswers[2],
        excludedUsers: [],
        description: description[true],
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.body).to.not.have.property('stack');
      Cypress.env('respStatus', resp.status)
      Cypress.env('respBody', resp.body)
    })
  })

Given(/^User send request for create voting "([^"]*)" dueDate for a file "([^"]*)"$/,
  (dueDate, file) => {
    const time = {
      without: '',
    }
    headers.Authorization = `Bearer ${Cypress.env('token')}`
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
    })
      .then((resp) => {
        expect(resp.body).to.not.have.property('stack');
        Cypress.env('respStatus', resp.status)
        Cypress.env('respBody', resp.body)
      })
  })

Given(/^User send request for create voting dueDate "([^"]*)" timeNow for a file "([^"]*)"$/,
  (operator, file) => {
    switch (operator) {
      case '<':
        time = Math.floor(new Date().getTime() / 1000.0) - 20000;
        break;
      case '==':
        time = Math.floor(new Date().getTime() / 1000.0);
        break;
    }
    // UTC time:
    // const t = new Date(time * 1000);
    // console.log(t.toLocaleString());
    headers.Authorization = `Bearer ${Cypress.env('token')}`
    cy.request({
      headers: headers,
      method: 'POST',
      url: '/voting',
      body: {
        hash: getHashFromFile(file, Cypress.env('filesInRoot')),
        dueDate: time.toString(),
        variants: variantsAnswers[2],
        excludedUsers: [],
        description: description[true],
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.body).to.not.have.property('stack');
      Cypress.env('respStatus', resp.status)
      Cypress.env('respBody', resp.body)
    })
  })
When(/^User send request for re\-create a vote for a file "([^"]*)" after the final first vote$/,
  (fileName) => {
    cy.wait(20000)
    const fakeTime = sinon.useFakeTimers(new Date(time * 1000))//.getTime()
    let date = new Date() //=> return the fake Date

    cy.request({
      headers: headers,
      method: 'POST',
      url: '/voting',
      body: {
        hash: getHashFromFile(fileName, Cypress.env('filesInRoot')),
        dueDate: date + 20000,
        variants: variantsAnswers[2],
        excludedUsers: [],
        description: description[true],
      },
      failOnStatusCode: false,
    }).then((resp) => {
      Cypress.env('respStatus', resp.status)
      fakeTime.restore()
      expect(resp.body).to.not.have.property('stack');
      let date2 = new Date() //=> will return the real time again (now)
      //console.log(date2)
    })
  })
Then(/^Count of voters = (\d+) in "([^"]*)" voting$/, (count, file) => {
  expect(Cypress.env('voters').length).to.eq(count)
})

Then(/^"([^"]*)" send request for get voting for a file "([^"]*)"$/, (user, file) => {
  let logins = {
    User1: Cypress.env('token'),
    User2: Cypress.env('token_2'),
    User3: Cypress.env('token_3'),
  }
  headers.Authorization = `Bearer ${logins[user]}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: '/voting',
    failOnStatusCode: false,
  }).then((resp) => {
    expect(resp.body).to.not.have.property('stack');
    Cypress.env('respStatus', resp.status)
    Cypress.env('respBody', resp.body)
    if (resp.status === 200 && resp.body.response.length !== 0) {
      expect(resp.body).to.not.have.property('message');

      let vote = getVoting(file, resp.body.response)
      Cypress.env('voters', vote.voters)
    }
  })
});

Given(/^User send request for create voting for file "([^"]*)" without "([^"]*)"$/, (file, user) => {

  let logins = {
    User1: [Cypress.env('login')],
    User2: [Cypress.env('login_2')],
    User3: [Cypress.env('login_3')],
    everyone: [Cypress.env('login_2'), Cypress.env('login_3')]
  }
  const fileHash = getHashFromFile(file, Cypress.env('filesInRoot'))
  headers.Authorization = `Bearer ${Cypress.env('token')}`
  cy.request({
    headers: headers,
    method: 'POST',
    url: '/voting',
    body: {
      hash: fileHash,
      dueDate: time.toString(),
      variants: variantsAnswers[2],
      excludedUsers: logins[user],
      description: description[true],
    },
    failOnStatusCode: false,
  }).then((resp) => {
      expect(resp.body).to.not.have.property('stack')
      Cypress.env('respBody', resp.body)
      Cypress.env('respStatus', resp.status)
      if (resp.status === 201 && resp.body.response.length !== 0) {
        expect(resp.body.response).to.not.have.property('message')

        let vote = getVoting(file, resp.body.response)
        expect(vote.description).to.eq(description[true])
        expect(vote.dueDate).to.eq(time.toString())
        expect(vote.votingName).to.eq(file)
        expect(vote.votingHash).to.not.eq(fileHash)

        Cypress.env('votes', resp.body.response)
        Cypress.env('voters', vote.voters)
      }
      Cypress.env('respBody', resp.body)
      Cypress.env('respStatus', resp.status)
    })
})
When(/^User send request for get voting without auth$/,  () =>  {
  headers.Authorization = `Bearer `
  cy.request({
    headers: headers,
    method: 'GET',
    url: '/voting',
    failOnStatusCode: false,
  }).then((resp) => {
    expect(resp.body).to.not.have.property('stack');
    Cypress.env('respStatus', resp.status)
  })
});
Then(/^Response body is empty$/, () =>  {
  expect(Cypress.env('respBody').response.length).to.eq(0)
});

When(/^"([^"]*)" send a request to vote for the "([^"]*)" variant for "([^"]*)" file$/, (user, variant, file) => {
  let tokens = {
    User1: Cypress.env('token'),
    User2: Cypress.env('token_2'),
    User3: Cypress.env('token_3'),
  }
  headers.Authorization = `Bearer ${tokens[user]}`
  cy.request({
    headers: headers,
    method: 'PUT',
    url: '/voting',
    body: {
      hash: Cypress.env('votingHash'),
      variant: variant,
    },
    failOnStatusCode: false,
  }).then((resp) => {
    console.log(resp.body)
    expect(resp.body).to.not.have.property('stack');
    if (resp.status === 200) {
      expect(resp.body.response).to.not.have.property('message');
      console.log(resp.body.response.voters)
      Cypress.env('voters', resp.body.response.voters)
    }
    Cypress.env('respBody', resp.body)
    Cypress.env('respStatus', resp.status)
  })
});
When(/^"([^"]*)" send a request to vote for the "([^"]*)" variant for "([^"]*)" file "([^"]*)" token$/, (user, variant, file, token) => {
  headers.Authorization = bearer[token]
  cy.request({
    headers: headers,
    method: 'PUT',
    url: '/voting',
    body: {
      hash: getHashFromFile(file, Cypress.env('filesInRoot')),
      variant: variant,
    },
    failOnStatusCode: false,
  }).then((resp) => {
    expect(resp.body).to.not.have.property('stack');
    Cypress.env('respBody', resp.body)
    Cypress.env('respStatus', resp.status)
  })
});
Then(/^Vote "([^"]*)" of "([^"]*)" was accepted$/, (variant, user) => {
  let tokens = {
    User1: Cypress.env('login'),
    User2: Cypress.env('login_2'),
    User3: Cypress.env('login_3'),
  }
  let v =  getVoteOfUser(tokens[user], Cypress.env('voters'))
  expect(variant).to.eq(v)
});
