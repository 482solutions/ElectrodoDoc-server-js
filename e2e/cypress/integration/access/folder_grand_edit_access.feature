@test_case_3.4
@grant_edit_access_for_a_folder

  # ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_3.3'

Feature: Grant edit access for a folder

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And User1 send request for create folder in root folder with name "Transfer"

  @positive
  Scenario: 1 Edit access by owner
    When The user1 sends a request to grant edit access to the folder "Transfer" to user2
    Then Response status 200
    And User 1 is the owner of the folder
    And User 2 is the editor and viewer of the folder
    And Verify that the user2 has the editor rights for "Transfer" folder
    And User can upload file "TestUpload.txt" to the folder "Transfer"

  @positive
  Scenario: 2 Edit access by editor
    When The user1 sends a request to grant edit access to the folder "Transfer" to user2
    And Response status 200
    And User 1 is the owner of the folder
    And Send request for create user3 and get token
    When The user1 sends a request to grant edit access to the folder "Transfer" to user3
    Then Response status 200
    And User 1 is the owner of the folder
    And User 2 is the editor and viewer of the folder
    And User 3 is the editor and viewer of the folder
    And Verify that the user3 has the editor rights for "Transfer" folder
    And Verify that the user2 has the editor rights for "Transfer" folder

  @negative
  Scenario: 3 User can not grand access for a folder to the user with incorrect email
    When The user1 sends a request to grant edit access to the folder "Transfer" to user with email "incorrectemail@g.com"
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 4 User can not grand access for a folder to the user if he already has them
    Given The user1 sends a request to grant edit access to the folder "Transfer" to user2
    And Response status 200
    When The user1 sends a request to grant edit access to the folder "Transfer" to user2
    Then Response status 409
    And Message "This user is the editor of this file"

  @negative
  Scenario: 5 Owner can not grand access for a folder to himself
    When The user1 sends a request to grant edit access to the folder "Transfer" to user1
    Then Response status 409
    And Message "This user is the editor of this file"

  Scenario: 6 Editor can not grand access for a file to himself
    Given The user1 sends a request to grant edit access to the folder "Transfer" to user2
    And Response status 200
    When The user2 sends a request to grant edit access to the folder "Transfer" to user2
    Then Response status 409
    And Message "This user is the editor of this file"

  @negative
  Scenario: 7 Owner can not grand access for a folder to some users
    Given Send request for create user3 and get token
    When The user1 sends a request to grant edit access to the folder "Transfer" to user2 and user3
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 8 Owner can not grand access for a folder if field "email" is empty
    When The user1 sends a request to grant edit access to the folder "Transfer" with empty email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 9 Owner can not grand access for a folder if field "email" contain spaces
    When The user1 sends a request to grant edit access to the folder "Transfer" with spaces in email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 10 Owner can not grand access for a folder if field "email" contain username
    When The user1 sends a request to grant edit access to the folder "Transfer" with username in email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 11 Editor can can not to transfer ownership for a folder
    Given Send request for create user3 and get token
    And The user1 sends a request to grant edit access to the folder "Transfer" to user2
    And Response status 200
    And User 1 is the owner of the folder
    When User2 as Editor send request for transfer ownership to user3
    Then Response status 422
    And Message "Incorrect hash"
