@test_case_3.9
@editor_revoke_access

  # ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_3.9'

Feature: Editor revoke access
  As an editor of the file (folder), I want to have "Revoke access"
  functionality so that I can revoke access to the file or folder of any editor or viewer (except owner).

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And The user send request for upload file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And Send request for create user3 and get token

  @positive
  Scenario: 1 Revoking edit access to the file by the editor
    And The "User2" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User3"
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" is the editor and viewer
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User3"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" not in editors list
    And "User3" is the viewer

  @positive
  Scenario: 2 Revoking view access to the file by the editor
    And The "User2" sends a request to grant "view" access to the "file" "mockTest.txt" to "User3"
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" is the viewer
    And "User3" not in editors list
    When The "User2" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User3"
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" not in editors list
    And "User3" not in viewer list

  @positive
  Scenario: 3 Revoking edit access to the folder by the editor
    And "User1" send request for create folder in root folder with name "Revoke"
    And The "User1" sends a request to grant "edit" access to the "folder" "Revoke" to "User2"
    And Response status 200
    And "User1" is the owner of the folder
    And "User2" is the editor and viewer
    And The "User2" sends a request to grant "edit" access to the "folder" "Revoke" to "User3"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" is the editor and viewer
    When The "User2" sends a request to revoke "view" access to the "folder" "Revoke" from the "User3"
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" not in editors list
    And "User3" not in viewer list

  @positive
  Scenario: 4 Revoking view access to the folder by the editor
    And "User1" send request for create folder in root folder with name "Revoke"
    And The "User1" sends a request to grant "edit" access to the "folder" "Revoke" to "User2"
    And Response status 200
    And "User1" is the owner of the folder
    And "User2" is the editor and viewer
    And The "User2" sends a request to grant "view" access to the "folder" "Revoke" to "User3"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" not in editors list
    And "User3" is the viewer
    When The "User2" sends a request to revoke "view" access to the "folder" "Revoke" from the "User3"
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" not in editors list
    And "User3" not in viewer list

  @negative
  Scenario: 5 Editor can not revoke edit access from the viewer
    And The "User2" sends a request to grant "view" access to the "file" "mockTest.txt" to "User3"
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" is the viewer
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User3"
    Then Response status 403

  @negative
  Scenario: 6 Editor can not revoke edit access from the owner
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User1"
    Then Message "User does not have such permissions"
    And Response status 403

  @negative
  Scenario: 7 Editor can not revoke view access from the owner
    When The "User2" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User1"
    Then Message "User does not have such permissions"
    And Response status 403

  @negative
  Scenario: 8 Editor can not revoke edit access for a file from the user with incorrect email
    And The "User2" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User3"
    And Response status 200
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "incorrectemail@g.com"
    Then Response status 422
    And Message "User for revoke not found"

  @negative
  Scenario: 9 Editor can not revoke view access for a file from the user with incorrect email
    And The "User2" sends a request to grant "view" access to the "file" "mockTest.txt" to "User3"
    And Response status 200
    When The "User2" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "incorrectemail@g.com"
    Then Response status 422
    And Message "User for revoke not found"

  Scenario: 10 Editor can not revoke edit access for a file from the user repeatedly
    And The "User2" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User3"
    And Response status 200
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User3"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" not in editors list
    And "User3" is the viewer
    And The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User3"
    Then Response status 403
    And Message "User does not have such permissions"

  Scenario: 11 Editor can not revoke view access for a file from the user repeatedly
    And The "User2" sends a request to grant "view" access to the "file" "mockTest.txt" to "User3"
    And Response status 200
    When The "User2" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User3"
    And Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" not in editors list
    And "User3" not in viewer list
    When The "User2" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User3"
    And Response status 403

  @negative
  Scenario: 12 Editor can not revoke edit access for a file from oneself
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" from the "User2"
    Then Response status 403

  @negative
  Scenario: 13 Editor can not revoke view access for a file from oneself
    When The "User2" sends a request to revoke "view" access to the "file" "mockTest.txt" from the "User2"
    Then Response status 403

  @positive
  Scenario: 14 Editor can revoke edit access for a file if field "email" contain username
    And The "User2" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User3"
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" with "username 3 in" email
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" not in editors list
    And "User3" is the viewer

  @positive
  Scenario: 15 Editor can revoke view access for a file if field "email" contain username
    And The "User2" sends a request to grant "view" access to the "file" "mockTest.txt" to "User3"
    When The "User2" sends a request to revoke "view" access to the "file" "mockTest.txt" with "username 3 in" email
    Then Response status 200
    And "User1" is the owner of the file
    And "User2" is the editor and viewer
    And "User3" not in editors list
    And "User3" not in viewer list

  @negative
  Scenario: 16 Editor can not revoke access for a file if field "email" is empty
    And The "User2" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User3"
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" with "empty" email
    Then Response status 422
    And Message "User for revoke not found"

  @negative
  Scenario: 17 Editor can not revoke access for a file if field "email" contain spaces
    And The "User2" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User3"
    When The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" with "spaces in" email
    Then Response status 422
    And Message "User for revoke not found"

  @negative
  Scenario: 18 Editor can not revoke access for a file if the parameter "email" is absent
    Given The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" without "email"
    Then Response status 400

  @negative
  Scenario: 19 Editor can not revoke access for a file if the parameter "permission" is absent
    Given The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" without "permission"
    Then Response status 422

  @negative
  Scenario: 20 Editor can not revoke access for a file if the parameter "hash" is absent
    Given The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" without "hash"
    Then Response status 400

  @negative
  Scenario: 21 Editor can not revoke access for a file if Bearer is empty
    And The "User2" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User3"
    Given The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" "with empty Bearer" to "User3"
    Then Response status 203

  @negative
  Scenario: 22 Editor can not revoke access for a file if Bearer is incorrect
    And The "User2" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User3"
    Given The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" "incorrect Bearer" to "User3"
    Then Response status 203

  @negative
  Scenario: 23 Editor can not revoke access for a file without Bearer
    And The "User2" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User3"
    Given The "User2" sends a request to revoke "edit" access to the "file" "mockTest.txt" "without Bearer" to "User3"
    Then Response status 203
