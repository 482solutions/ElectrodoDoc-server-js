@test_case_3.8
@owner_revoke_access

  # ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_3.8'

Feature: Owner revoke access
  As an owner of the file (folder), I want to have "Revoke access"
  functionality so that I can revoke access to my file or folder of any user.

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token

  @positive
  Scenario: 1 Revoking edit access to the file by the owner
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    When The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User2"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list

  @positive
  Scenario: 2 After revoking access rights for editing, the user can get them again
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    When The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User2"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list
    When The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer

  @positive
  Scenario: 3 After revoking access rights for viewing, the user can get them again
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list
    When The "User1" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User2"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" not in viewer list
    And "User2" not in editors list
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User2"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list

  @positive
  Scenario: 4 After revoking access rights for viewing, the user can get rights for editing
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list
    When The "User1" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User2"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" not in viewer list
    And "User2" not in editors list
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer

  @positive
  Scenario: 5 Revoking edit access to the folder by the owner
    And "User1" send request for create folder in root folder with name "Revoke"
    And The "User1" sends a request to grant "edit" access to the "folder" "Revoke" to "User2"
    And Response status 200
    And "User1" is the owner of the folder
    And "User2" is the editor and viewer
    When The "User1" sends a request to revoke "edit" access to the "folder" "Revoke" from the "User2"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list

  @positive
  Scenario: 6 Revoking view access to the file by the owner
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list
    When The "User1" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User2"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" not in viewer list
    And "User2" not in editors list

  @positive
  Scenario: 7 Revoking view access to the folder by the owner
    And "User1" send request for create folder in root folder with name "Revoke"
    And The "User1" sends a request to grant "view" access to the "folder" "Revoke" to "User2"
    And Response status 200
    And "User1" is the owner of the folder
    And "User2" is the viewer
    When The "User1" sends a request to revoke "view" access to the "folder" "Revoke" from the "User2"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" not in viewer list
    And "User2" not in editors list

  @negative
  Scenario: 8 Owner can not revoke edit access from the viewer
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list
    When The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User2"
    Then Response status 403

  @negative
  Scenario: 9 Viewer can not revoke edit access from the owner
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User1"
    Then Message "You does not have permission"
    And Response status 403

  @negative
  Scenario: 10 Viewer can not revoke view access from the owner
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the viewer
    And "User2" not in editors list
    When The "User2" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User1"
    Then Message "You does not have permission"
    And Response status 403

  @negative
  Scenario: 11 User can not revoke edit access for a file from the user with incorrect email
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    When The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "incorrectemail@g.com"
    Then Response status 422
    And Message "User for revoke not found"

  @negative
  Scenario: 12 User can not revoke edit access for a file from the user repeatedly
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    When The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User2"
    And Response status 200
    And The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User2"
    Then Response status 403
    And Message "User for revoke not found"

  @negative
  Scenario: 13 Owner can not revoke edit access for a file from oneself
    And The user send request for upload file "mockTest.txt"
    When The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User1"
    Then Response status 403

  Scenario: 14 Owner can not revoke edit access for a file if field "email" contain username
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    When The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" with "username in" email
    Then Response status 422
    And Message "User for revoke not found"

  @negative
  Scenario: 15 Owner can not revoke access for a file if field "email" is empty
    When The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" with "empty" email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 16 Owner can not revoke access for a file if field "email" contain spaces
    When The "User1" sends a request to revoke "edit" access to the "file" "mockTest.txt" with "spaces in" email
    Then Response status 422
    And Message "User for sharing not found"

  @negative
  Scenario: 17 Owner can not revoke access for a file if the parameter "email" is absent
    Given The user1 sends a request to revoke "edit" access to the "file" "mockTest.txt" without "email"
    Then Response status 422

  @negative
  Scenario: 18 Owner can not revoke access for a file if the parameter "permissions" is absent
    Given The user1 sends a request to revoke "edit" access to the "file" "mockTest.txt" without "permissions"
    Then Response status 422

  @negative
  Scenario: 19 Owner can not revoke access for a file if the parameter "hash" is absent
    Given The user1 sends a request to revoke "edit" access to the "file" "mockTest.txt" without "hash"
    Then Response status 422

