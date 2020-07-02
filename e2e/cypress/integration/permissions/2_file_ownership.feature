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
    Given "User1" sends request to transfer file ownership to "User2"
    Then Response status 200
    And "User1" is the editor and viewer
    And "User2" is the owner of the file
    And "User2" can send request for a file "mockTest.txt"

  Scenario: 2 User2 can back file ownership to user1
    Given "User1" sends request to transfer file ownership to "User2"
    And "User1" is the editor and viewer
    And "User2" can send request for a file "mockTest.txt"
    When User2 can back to user1 file ownership
    Then Response status 200
    And "User2" is the editor and viewer
    And "User1" can send request for a file "mockTest.txt"

  Scenario: 3 Transfer file permissions from user1 to user3
    Given "User1" sends request to transfer file ownership to "User2"
    And "User1" is the editor and viewer
    And "User2" is the owner of the file
    And "User2" can send request for a file "mockTest.txt"
    When Send request for create user3 and get token
    And "User2" sends request to transfer file ownership to "User3"
    Then Response status 200
    And "User2" is the editor and viewer
    And "User3" can send request for a file "mockTest.txt"

  Scenario: 4 Transfer of permissions to a nonexistent user
    Given User sends a request to transfer file ownership to nonexistent user
    Then Response status 422
    And Message "User for sharing not found"

  Scenario: 5 Transfer of permissions to a nonexistent file
    Given User sends a request to transfer of rights to a nonexistent file
    Then Response status 422
    And Message "File with this hash does not exist"

  Scenario: 6 Transfer permissions without with empty Bearer
    Given User sends a request to transfer file ownership with Empty Bearer
    Then Response status 203
    And Message "Not Authorized"

  Scenario: 7 Transfer permissions without without Bearer
    Given User sends a request to transfer file ownership without Bearer
    Then Response status 203
    And Message "Not Authorized"

  Scenario Outline: 8 Transfer incorrect permission
    And User sends a request to transfer file ownership with incorrect permission <incPermission>
    Then Response status 400
    Examples: incPermission
      | incPermission |
      | writer         |
      | view          |
      | OWNER         |

  Scenario: 9 Transfer permissions with empty email
    And User sends a request to transfer file ownership with empty email
    Then Response status 422
    And Message "User for sharing not found"

  Scenario: 10 Transfer permissions with empty hash
    And User sends a request to transfer file ownership with empty hash
    Then Response status 422
    And Message "Incorrect hash"

  Scenario: 11 Transfer permissions with empty permission
    And User sends a request to transfer file ownership with empty permission
    Then Response status 400

  Scenario: 12 User can not transfer file ownership to the user if he already has them
    And User sends a request to transfer file ownership to the user if he already has them
    Then Response status 409
    And Message "This user is the owner of this file"
