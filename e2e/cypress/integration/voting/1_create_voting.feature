@test_case_4.1
@create_voting
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_4.1'

Feature: Creating voting
  As a file owner, I want to create new voting so that I can collect other opinions
  Time is calculated based on GMT +3

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And The user send request for upload file "mockTest.txt"
    And The user send request for updating file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User3"

  Scenario Outline: 1 Owner can create voting of the file with variants of answers
    Given User send request for create voting with <count> answers for a 2 version of the file "mockTest.txt" and description "true"
    Examples: Count of answers
      | count |
      | 2     |
      | 3     |
      | 4     |
      | 5     |

  Scenario: 2 Owner can create voting for a last version of the file
    Given User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "true"
    Then Response status

  Scenario: 3 Owner can create voting without description
    Given User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "false"
    Then Response status

  Scenario: 4 Owner can create voting with description
    Given User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "true"
    Then Response status

  Scenario: 5 Owner can not create voting without token
    Given User send request for create voting "without" token for a file "mockTest.txt"
    Then Response status

  Scenario: 6 Owner can not create voting with incorrect token
    Given User send request for create voting "incorrect" token for a file "mockTest.txt"
    Then Response status

  Scenario: 7 Owner can not create voting with incorrect fileHash
    Given User send request for create voting "incorrect" fileHash
    Then Response status

  Scenario: 8 Owner can not create voting without fileHash
    Given User send request for create voting "without" fileHash
    Then Response status

  Scenario: 9 Owner can not create voting with not latest cid
    Given User send request for create voting with 2 answers for a 1 version of the file "mockTest.txt" and description "true"
    Then Response status

  Scenario: 10 Owner can not create voting if cid null
    Given User send request for create voting with 2 answers for a 0 version of the file "mockTest.txt" and description "true"
    Then Response status

  Scenario: 11 Owner can not create voting without dueDate
    Given User send request for create voting "without" dueDate for a file "mockTest.txt"
    Then Response status

  Scenario: 12 Owner can not create voting if dueDate < timeNow
    Given User send request for create voting dueDate "<" timeNow for a file "mockTest.txt"
    Then Response status

  Scenario: 13 Owner can not create voting if dueDate == timeNow
    Given User send request for create voting dueDate "==" timeNow for a file "mockTest.txt"
    Then Response status

  Scenario Outline: 14 Owner can not create voting if there are less than 2 answer options
    Given User send request for create voting with <count> answers for a 1 version of the file "mockTest.txt" and description "true"
    Examples: Count of answers
      | count |
      | 0     |
      | 1     |
    Then Response status

  Scenario Outline: 15 Owner can not create voting if there are more than 5 answer options
    Given User send request for create voting with <count> answers for a 1 version of the file "mockTest.txt" and description "true"
    Examples: Count of answers
      | count |
      | 6     |
      | 7     |
    Then Response status

  Scenario: 16 Owner can not create voting if another users haven't got permissions for this file
    Given The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User2"
    And The "User1" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User3"
    When User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "true"
    Then Response status

  Scenario: 17 Owner can not cannot re-create a vote
    Given User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "false"
    Then Response status
    Given User send request for create voting with 3 answers for a 2 version of the file "mockTest.txt" and description "false"
    Then Response status 409

  Scenario: 18 Owner can't create voting if description more than 256 characters
    Given User send request for create voting with 2 answers for a 2 version of the file "mockTest.txt" and description "big"
    Then Response status







