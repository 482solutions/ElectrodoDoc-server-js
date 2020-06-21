@api
@post
# ./node_modules/.bin/cypress-tags run -e TAGS='@'

Feature: Login user into the system
  Authentication for users to get in to the system and receive JWT token

  Background: Create user
    Given I send request for create user
    Then Response status 201

  @positive
  Scenario:  Getting JWT token with username
    Given I send request for getting JWT token with username
    When Response status 200
    Then Response body contains valid JWT token

  Scenario:  Getting JWT token with email
    Given I send request for getting JWT token with email
    When Response status 200
    Then Response body contains valid JWT token

  Scenario: User can not get JWT token with incorrect password
    Given I send request for getting JWT token with incorrect password
    When Response status 400

  Scenario: User can not get JWT token with incorrect username
    Given I send request for getting JWT token with incorrect username
    When Response status 404

  Scenario: User can not get JWT token with incorrect username and incorrect password
    Given I send request for getting JWT token with incorrect username and incorrect password
    When Response status 404

  Scenario: User can not get JWT token without username
    Given I send request for getting JWT token without username
    When Response status 422

  Scenario: User can not get JWT token with incorrect cert
    Given I send request for getting JWT token with incorrect cert
    When Response status 403

  Scenario: User can not get JWT token with incorrect privateKey
    Given I send request for getting JWT token with incorrect privateKey
    When Response status 403

  Scenario: User can not get JWT token with incorrect cert and incorrect privateKey
    Given I send request for getting JWT token with incorrect cert and incorrect privateKey
    When Response status 403



