@test_case_3.4
@grant_edit_access_for_a_folder

  # ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_3.4'

Feature: Grant edit access for a folder
  As an owner or editor of the folder, I want to provide rights for
  edition to another User so that this user can operate with this folder.

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And "User1" send request for create folder in root folder with name "Transfer"

  @positive
  Scenario: 1 Edit access by owner
    When The "User1" sends a request to grant "edit" access to the "folder" "Transfer" to "User2"
    Then Response status 200
    And "User1" is the owner of the folder
    And "User2" is the editor and viewer
    And Verify that the "User2" has the rights for "Transfer" "folder"
    And User can upload file "TestUpload.txt" to the folder "Transfer"

  @positive
  Scenario: 2 Edit access by editor
    When The "User1" sends a request to grant "edit" access to the "folder" "Transfer" to "User2"
    And Response status 200
    And "User1" is the owner of the folder
    And "User2" is the editor and viewer
    And Send request for create user3 and get token
    When The "User2" sends a request to grant "edit" access to the "folder" "Transfer" to "User3"
    Then Response status 200
    And "User1" is the owner of the folder
    And "User2" is the editor and viewer
    And "User3" is the editor and viewer
    And Verify that the "User3" has the rights for "Transfer" "folder"
    And Verify that the "User2" has the rights for "Transfer" "folder"

  @negative
  Scenario: 3 User can not grand access for a folder to the user with incorrect email
    When The "User1" sends a request to grant "edit" access to the "folder" "Transfer" to "incorrectemail@g.com"
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 4 User can not grand access for a folder to the user if he already has them
    Given The "User1" sends a request to grant "edit" access to the "folder" "Transfer" to "User2"
    And Response status 200
    When The "User1" sends a request to grant "edit" access to the "folder" "Transfer" to "User2"
    Then Response status 409
    And Message "This user is the editor of this file"

  @negative
  Scenario: 5 Owner can not grand access for a folder to himself
    When The "User1" sends a request to grant "edit" access to the "folder" "Transfer" to "User1"
    Then Response status 409
    And Message "This user is the owner of this file"

  Scenario: 6 Editor can not grand access for a file to himself
    Given The "User1" sends a request to grant "edit" access to the "folder" "Transfer" to "User2"
    And Response status 200
    When The "User2" sends a request to grant "edit" access to the "folder" "Transfer" to "User2"
    Then Response status 409
    And Message "This user is the editor of this file"

  @negative
  Scenario: 7 Owner can not grand access for a folder to some users
    Given Send request for create user3 and get token
    When The user1 sends a request to grant "edit" access to the "folder" "Transfer" to user2 and user3
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 8 Owner can not grand access for a folder if field "email" is empty
    When The "User1" sends a request to grant "edit" access to the "folder" "Transfer" with "empty" email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 9 Owner can not grand access for a folder if field "email" contain spaces
    When The "User1" sends a request to grant "edit" access to the "folder" "Transfer" with "spaces in" email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 10 Owner can grand access for a folder if field "email" contain username
    When The "User1" sends a request to grant "edit" access to the "folder" "Transfer" with "username in" email
    Then Response status 200

  @negative
  Scenario: 11 Editor can can not to transfer ownership for a folder
    Given Send request for create user3 and get token
    And The "User1" sends a request to grant "edit" access to the "folder" "Transfer" to "User2"
    And Response status 200
    And "User1" is the owner of the folder
    When The "User2" sends a request to grant "owner" access to the "folder" "Transfer" to "User3"
    Then Response status 422
    And Message "User does not have permission"

  @negative
  Scenario: 12 Owner can not grand access for a folder if the parameter "email" is absent
    Given The user1 sends a request to grant "edit" access to the "folder" "Transfer" without "email"
    Then Response status 422

  @negative

  Scenario: 13 Owner can not grand access for a folder if the parameter "permissions" is absent
    Given The user1 sends a request to grant "edit" access to the "folder" "Transfer" without "permissions"
    Then Response status 422

  @negative
  Scenario: 14 Owner can not grand access for a folder if the parameter "hash" is absent
    Given The user1 sends a request to grant "edit" access to the "folder" "Transfer" without "hash"
    Then Response status 422
