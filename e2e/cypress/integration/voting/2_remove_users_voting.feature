@test_case_4.2
@remove_users_from_voting
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_4.2'

Feature: Remove users from voting
  As a file owner, I want to manage the list of voters so that I can remove some users from voting

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And Send request for create user3 and get token
    And The user send request for upload file "mockTest.txt"
    And The user send request for updating file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User3"
    And Response status 200

  Scenario: 1 Owner can create voting if owner deletes one user out of two
    Given User send request for create voting for file "mockTest.txt" without "User2"
    Then Response status 201
    And Count of voters = 2 in "mockTest.txt" voting

  Scenario: 2 Owner can't create voting if owner deletes all users
    Given User send request for create voting for file "mockTest.txt" without "everyone"
    Then Response status 422

  Scenario: 3 Revoked user can get vote for a file
    When User send request for create voting with 2 answers for a file "mockTest.txt" and description "true"
    Then Response status 201
    And Count of voters = 3 in "mockTest.txt" voting
    When The "User1" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User3"
    Then Response status 200
    And "User1" send request for get voting for a file "mockTest.txt"
    And Count of voters = 3 in "mockTest.txt" voting

