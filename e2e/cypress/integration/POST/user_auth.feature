@api
@post
# ./node_modules/.bin/cypress-tags run -e TAGS='@'

Feature: Login user into the system
  Authentication for users to get in to the system and receive JWT token

  Background: Create user
    Given I sending a request for create new user
    When I got response status 201 auth

  @positive
  Scenario:  Getting JWT token with username
    Given I send request for getting JWT token with username
    When I got response status 200 auth
    Then Response body contains valid JWT token

  Scenario:  Getting JWT token with email
    Given I send request for getting JWT token with email
    When I got response status 200 auth
    Then Response body contains valid JWT token

  Scenario: User can not get JWT token with incorrect password
    Given I send request for getting JWT token with incorrect password
    When I got response status 400 auth

  Scenario: User can not get JWT token with incorrect username
    Given I send request for getting JWT token with incorrect username
    When I got response status 404 auth

  Scenario: User can not get JWT token with incorrect username and incorrect password
    Given I send request for getting JWT token with incorrect username and incorrect password
    When I got response status 404 auth

  Scenario: User can not get JWT token without username
    Given I send request for getting JWT token without username
    When I got response status 422 auth

  Scenario: User can not get JWT token with incorrect cert
    Given I send request for getting JWT token with incorrect cert
    When I got response status 403 auth

  Scenario: User can not get JWT token with incorrect privateKey
    Given I send request for getting JWT token with incorrect privateKey
    When I got response status 403 auth

  Scenario: User can not get JWT token with incorrect cert and incorrect privateKey
    Given I send request for getting JWT token with incorrect cert and incorrect privateKey
    When I got response status 403 auth




