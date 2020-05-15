@test_case_2.2
@open_folders
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.2'

Feature: Open folders
  As a user (any role), I want to open any available folder so that I can upload files there.

  Rule: user should be registered.
    #  Before('Register new user, sign in and create folders', function () {
    #    | Name                 |
    #    | F                    |
    #    | Folder-1             |
    #    | folder2              |
    #    | FOLDER 3             |
    #    | Folder12345678901234 |
    #    | Папка                |
    #    | 資料夾                |
    #  });

  Scenario Outline: 1 Open folder
    Given The user is authorized
    And the user has access to any available folder (not root)
    When The user double click this folder <folder> from list
    Then Folder is opened
    And User go back to root folder
    Examples: folder
      | folder               |
      | F                    |
      | Folder-1             |
      | folder2              |
      | FOLDER 3             |
      | Folder12345678901234 |
      | Папка                |
      | 資料夾                |

  Scenario Outline: 2 Open folder with Enter key
    Given  The user is authorized
    And  the user has access to any available folder (not root)
    When  The user click on  this folder <folder> from list
    And Press Enter
    Then  Folder is opened
    And  Used go back to root folder
    Examples: folder
      | folder               |
      | F                    |
      | Folder-1             |
      | folder2              |
      | FOLDER 3             |
      | Folder12345678901234 |
      | Папка                |
      | 資料夾                |
