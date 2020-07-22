@test_case_4.3
@view_open_vote
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_4.3'

Feature: View an open vote
  As a user (any role), I want to have a voting tab in my dashboard,
  so that I can see all available voting.

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And The user send request for upload file "mockTest.txt"
    And The user send request for updating file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"

  Scenario: 1 Owner can view an open vote
    Given User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "true"
    When "User1" send request for view an open vote
    Then Response status

  Scenario: 2 Editor can view an open vote
    Given User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "true"
    When "User2" send request for view an open vote
    Then Response status

  Scenario: 3 Viewer can view an open vote
    Given Send request for create user3 and get token
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User2"
    And User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "true"
    When "User3" send request for view an open vote
    Then Response status

  Scenario: 4 User without permissions can't view an open vote
    Given Send request for create user3 and get token
    And User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "true"
    When "User3" send request for view an open vote
    Then Response status

  Scenario: 5 User can't view an open vote if after the start of voting his rights were taken away
    And User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "true"
    Given The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User2"
    And The "User1" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User2"
    When "User2" send request for view an open vote
    Then Response status
