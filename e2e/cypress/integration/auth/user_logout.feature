@api
@delete
# ./node_modules/.bin/cypress-tags run -e TAGS='@'

Feature: Logout user from the system

  Background: Create user
    Given Send request for create user and get token
    Then Response status 200

  Scenario: Logout
    Given I send request for logout
    Then Response status 200

  Scenario: User cannot logout without authorization
    Given I send request for logout without token
    Then Response status 203

  Scenario: User cannot logout with incorrect token
    Given I send request for logout with incorrect token
    Then Response status 203
