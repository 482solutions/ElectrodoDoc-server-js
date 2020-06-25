@test_case_3.1
@transfer_folder_ownership
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_3.1'

Feature:  Transfer folder ownership
  As an owner, I want to transfer the ownership of the folder so that the new owner will have all rights to it.

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And User1 send request for create folder in root folder with name "Transfer"

  Scenario: 1 Transfer folder permissions
    Given User sends request to transfer folder ownership to user2
    Then Response status 200
    And User 1 is the editor and viewer of the folder
    And User 2 is the owner of the folder
    And Verify that the user2 has a folder "Transfer"

  Scenario: 2 User2 can back folder ownership to user1
    Given User sends request to transfer folder ownership to user2
    And User 2 is the owner of the folder
    And User 1 is the editor and viewer of the folder
    And Verify that the user2 has a folder "Transfer"
    When User2 can back to user1 folder ownership
    Then Response status 200
    And User 2 is the editor and viewer of the folder
    And Verify that the user1 has a folder "Transfer"

  Scenario: 3 Transfer folder permissions from user2 to user3
    Given User sends request to transfer folder ownership to user2
    And User 2 is the owner of the folder
    And User 1 is the editor and viewer of the folder
    And Verify that the user2 has a folder "Transfer"
    When Send request for create user3 and get token
    And User sends request to transfer folder ownership to user3
    Then Response status 200
    And User 3 is the owner of the folder
    And User 1 is the editor and viewer of the folder
    And User 2 is the editor and viewer of the folder
    And Verify that the user3 has a folder "Transfer"

  Scenario: 4 User can not get ownership to father folder
    Given User1 send request for create folder in folder Transfer with name "Transfer_2"
    When User sends request to transfer of ownership to the "Transfer_2" to user2
    And User 1 is the editor and viewer of the folder
    And User 2 is the owner of the folder
    And Verify that the user2 has a folder "Transfer_2"
    Then User2 does not have access to folder Transfer
    And Message "You does not have permission"

  Scenario: 5 Transfer of permissions to a nonexistent user
    Given User sends a request to transfer folder ownership to nonexistent user
    Then Response status 422
    And Message "User for sharing not found"

  Scenario: 6 Transfer of permissions to a nonexistent folder
    Given User sends a request to transfer of rights to a nonexistent folder
    Then Response status 422
    And Message "File with this hash does not exist"

  Scenario: 7 Transfer permissions without with empty Bearer
    Given User sends a request to transfer folder ownership with Empty Bearer
    Then Response status 203
    And Message "Not Authorized"

  Scenario: 8 Transfer permissions without without Bearer
    Given User sends a request to transfer folder ownership without Bearer
    Then Response status 203
    And Message "Not Authorized"

  Scenario Outline: 9 Transfer incorrect permission
    Given User sends a request to transfer folder ownership with incorrect permission <incPermission>
    Then Response status 400
    Examples: incPermission
      | incPermission |
      | writer        |
      | view          |
      | OWNER         |

  Scenario: 10 Transfer permissions with empty email
    Given User sends a request to transfer folder ownership with empty email
    Then Response status 422
    And Message "User for sharing not found"

  Scenario: 11 Transfer permissions with empty hash
    Given User sends a request to transfer folder ownership with empty hash
    Then Response status 422
    And Message "Incorrect hash"

  Scenario: 12 Transfer permissions with empty permission
    And User sends a request to transfer folder ownership with empty permission
    Then Response status 400

  Scenario: 13 User can not transfer folder ownership to the user if he already has them
    And User sends a request to transfer folder ownership to the user if he already has them
    Then Response status 409
    And Message "This user is the owner of this file"

