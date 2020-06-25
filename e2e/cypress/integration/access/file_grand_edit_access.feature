@test_case_3.4
@grant_edit_access_for_a_file

  # ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_3.3'

Feature: Grant edit access for a file
  As an owner or editor of the file, I want to provide rights for
  edition to anotherUser so that this user can operate with this file.

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And The user send request for upload file "mockTest.txt"

  @positive
  Scenario: 1 Edit access by owner
    When The user1 sends a request to grant edit access to the file "mockTest.txt" to user2
    Then Response status 200
    And User 1 is the owner of the file
    And Verify that the user2 has the editor rights for "mockTest.txt" file

  @positive
  Scenario: 2 Edit access by editor
    Given The user1 sends a request to grant edit access to the file "mockTest.txt" to user2
    And Response status 200
    And User 1 is the owner of the file
    And Send request for create user3 and get token
    When The user2 sends a request to grant edit access to the file "mockTest.txt" to user3
    Then Response status 200
    And User 1 is the owner of the file
    And Verify that the user3 has the editor rights for "mockTest.txt" file
    And Verify that the user2 has the editor rights for "mockTest.txt" file

  @negative
  Scenario: 3 User can not grand access for a file to the user with incorrect email
    When The user1 sends a request to grant edit access to the file "mockTest.txt" to user with email "incorrectemail@g.com"
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 4 User can not grand access for a file to the user if he already has them
    Given The user1 sends a request to grant edit access to the file "mockTest.txt" to user2
    And Response status 200
    When The user1 sends a request to grant edit access to the file "mockTest.txt" to user2
    Then Response status 409
    And Message "This user is the editor of this file"

  @negative
  Scenario: 5 Owner can not grand access for a file to himself
    When The user1 sends a request to grant edit access to the file "mockTest.txt" to user1
    Then Response status 409
    And Message "This user is the editor of this file"

  Scenario: 6 Editor can not grand access for a file to himself
    Given The user1 sends a request to grant edit access to the file "mockTest.txt" to user2
    And Response status 200
    When The user2 sends a request to grant edit access to the file "mockTest.txt" to user2
    Then Response status 409
    And Message "This user is the editor of this file"

  @negative
  Scenario: 7 Owner can not grand access for a file to some users
    Given Send request for create user3 and get token
    When The user1 sends a request to grant edit access to the file "mockTest.txt" to user2 and user3
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 8 Owner can not grand access for a file if field "email" is empty
    When The user1 sends a request to grant edit access to the file "mockTest.txt" with empty email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 9 Owner can not grand access for a file if field "email" contain spaces
    When The user1 sends a request to grant edit access to the file "mockTest.txt" with spaces in email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 10 Owner can not grand access for a file if field "email" contain username
    When The user1 sends a request to grant edit access to the file "mockTest.txt" with username in email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 11 Editor can can not to transfer ownership for a file
    Given Send request for create user3 and get token
    And The user1 sends a request to grant edit access to the file "mockTest.txt" to user2
    And Response status 200
    And User 1 is the owner of the file
    When User2 as Editor send request for transfer ownership to user3
    Then Response status 422
    And Message "Incorrect hash"



