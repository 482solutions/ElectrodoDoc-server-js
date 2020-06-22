@test_case_3.2
@transfer_file_ownership
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_3.2'

Feature:  Transfer file ownership
  As an owner, I want to transfer the ownership of the file so that the new owner will have all rights to it.

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And The user send request for upload file "mockTest.txt"

  Scenario: 1 Transfer file permissions
    Given User sends request to transfer file ownership to user2
    Then Response status 200
    And Verify that the user2 has a file "mockTest.txt"

  Scenario: 2 User2 can back file ownership to user1
    Given User sends request to transfer file ownership to user2
    And Verify that the user2 has a file "mockTest.txt"
    When User2 can back to user1 file ownership
    Then Response status 200
    And Verify that the user1 has a file "mockTest.txt"

  Scenario: 3 Transfer file permissions from user1 to user3
    Given User sends request to transfer file ownership to user2
    And Verify that the user2 has a file "mockTest.txt"
    When Send request for create user3 and get token
    And User sends request to transfer file ownership to user3
    Then Response status 200
    And Verify that the user3 has a file "mockTest.txt"

  Scenario: 4 Transfer of permissions to a nonexistent user
    Given User sends a request to transfer file ownership to nonexistent user
    Then Response status 422

  Scenario: 5 Transfer of permissions to a nonexistent file
    Given User sends a request to transfer of rights to a nonexistent file
    Then Response status 422

  Scenario: 6 Transfer permissions without with empty Bearer
    Given User sends a request to transfer file ownership with Empty Bearer
    Then Response status 203

  Scenario: 7 Transfer permissions without without Bearer
    Given User sends a request to transfer file ownership without Bearer
    Then Response status 203

  Scenario Outline: 8 Transfer incorrect permission
    And User sends a request to transfer file ownership with incorrect permission <incPermission>
    Then Response status 422
    Examples: incPermission
      | incPermission |
      | write         |
      | view          |
      | OWNER         |

  Scenario: 9 Transfer permissions with empty email
    And User sends a request to transfer file ownership with empty email
    Then Response status 422

  Scenario: 10 Transfer permissions with empty hash
    And User sends a request to transfer file ownership with empty hash
    Then Response status 422

  Scenario: 11 Transfer permissions with empty permission
    And User sends a request to transfer file ownership with empty permission
    Then Response status 422