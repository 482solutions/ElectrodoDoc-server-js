@test_case_3.1
@transfer_folder_ownership
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_3.2'
#TODO:
Feature:  Transfer folder ownership
  As an owner, I want to transfer the ownership of the folder so that the new owner will have all rights to it.

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And User1 send request for create folder in root folder with name "Transfer"

  Scenario: 1 Transfer file permissions
    Given User sends request to transfer folder ownership to "user2"
    Then Response status 200
    And Verify that the user has a folder "Transfer"

  Scenario: 2 Transfer of permissions to a nonexistent user
    Given User sends a request to transfer folder ownership to nonexistent user
    Then Response status 422

  Scenario: 3 Transfer of permissions to a nonexistent folder
    Given User sends a request to transfer of rights to a nonexistent folder
    Then Response status 422

  Scenario: 4 Transfer permissions without with empty Bearer
    Given User sends a request to transfer folder ownership with Empty Bearer
    Then Response status 203

  Scenario: 5 Transfer permissions without without Bearer
    Given User sends a request to transfer folder ownership without Bearer
    Then Response status 203

  Scenario Outline: 6 Transfer incorrect permission
    Given User sends a request to transfer folder ownership with incorrect permission <incPermission>
    Then Response status 422
    Examples: incPermission
      | incPermission |
      | writer        |
      | viewer        |
      | OWNER         |

  Scenario: 7 Transfer permissions with empty email
    Given User sends a request to transfer folder ownership with empty email
    Then Response status 422

  Scenario: 8 Transfer permissions with empty hash
    Given User sends a request to transfer folder ownership with empty hash
    Then Response status 422

  Scenario: 9 Transfer permissions with empty permission
    And User sends a request to transfer folder ownership with empty permission
    Then Response status 422