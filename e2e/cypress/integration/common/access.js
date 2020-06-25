import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Then(/^User 1 is the editor and viewer of the folder$/,  () => {
  expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login'))).to.be.true
  expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login'))).to.be.true
});

Then(/^User 2 is the editor and viewer of the folder$/,  () => {
  expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_2'))).to.be.true
  expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_2'))).to.be.true
});

Then(/^User 3 is the editor and viewer of the folder$/,  () => {
  expect(Cypress.env('respBody').response.readUsers.includes(Cypress.env('login_3'))).to.be.true
  expect(Cypress.env('respBody').response.writeUsers.includes(Cypress.env('login_3'))).to.be.true
});

Given(/^User 1 is the owner of the folder$/,  () => {
  expect(Cypress.env('login')).to.equal(Cypress.env('respBody').response.ownerId)
});

Then(/^User 2 is the owner of the folder$/,  () => {
  expect(Cypress.env('login_2')).to.equal(Cypress.env('respBody').response.ownerId)
});

Then(/^User 3 is the owner of the folder$/,  () => {
  expect(Cypress.env('login_3')).to.equal(Cypress.env('respBody').response.ownerId)
});
