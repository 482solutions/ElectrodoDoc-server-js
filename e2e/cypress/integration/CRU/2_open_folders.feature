@test_case_2.2
@open_folders
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.2'

Feature: Open folders
  As a user (any role), I want to open any available folder so that I can upload files there.

  Rule: user should be registered.

    Scenario: 1 Create user and get JWT token
      Given Send request for create user and get token

    Scenario Outline: 2 Create folders in root folder
      When The user sent a request to create a folder in the root folder with the name <Names>
      Then Response status 201
      Examples: Folder's Name
        | Names                |
        | F                    |
        | Folder-1             |
        | folder2              |
        | FOLDER 3             |
        | Folder12345678901234 |
        | Папка                |
        | 資料夾                  |

    Scenario: 3 Get folder with name F
      Given The user sent a request to receive a folder in the root folder with the name F
      Then Response status 200

    Scenario: 4 Get folder with name Folder-1
      Given The user sent a request to receive a folder in the root folder with the name Folder-1
      Then Response status 200

    Scenario: 5 Get folder with name folder2
      Given The user sent a request to receive a folder in the root folder with the name folder2
      Then Response status 200

    Scenario: 6 Get folder with name FOLDER 3
      Given The user sent a request to receive a folder in the root folder with the name FOLDER 3
      Then Response status 200

    Scenario: 7 Get folder with name Folder12345678901234
      Given The user sent a request to receive a folder in the root folder with the name Folder12345678901234
      Then Response status 200

    Scenario: 8 Get folder with name Папка
      Given The user sent a request to receive a folder in the root folder with the name Папка
      Then Response status 200

    Scenario: 8 Get folder with name 資料夾
      Given The user sent a request to receive a folder in the root folder with the name 資料 夾
      Then Response status 200

    Scenario: 9 User cannot receive folder without authorization
      Given The user sends a request for a folder without authorization
      Then Response status 203

    Scenario: 10 User cannot receive folder with incorrect hash
      Given The user sends a request for a folder with incorrect hash
      Then Response status 404
