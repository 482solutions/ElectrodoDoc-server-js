@api
@delete
# ./node_modules/.bin/cypress-tags run -e TAGS='@'

Feature: Logout user from the system

  Background: Create user and get JWT token
    Given I send request for create user and get token
    Then I got response status 200 out

  Scenario: As user with JWT token I can logout
    Given I send request for logout
    Then I got response status 200 out

  Scenario: User cannot logout without authorization
    Given I send request for logout without token
    Then I got response status 203 out

  Scenario: User cannot logout with incorrect token
    Given I send request for logout with incorrect token
    Then I got response status 203 out
