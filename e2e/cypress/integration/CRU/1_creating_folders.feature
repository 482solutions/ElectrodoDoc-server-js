@test_case_2.1
@creating_folders
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.1'

Feature: Creating folders
  As a user (any role), I want to create a new folder so that I can upload files in it.
  For the folder name, the minimum amount of number is 1
  and the maximum amount of numbers is 20. All symbols are allowed.

  Rule: user should be registered.

  Scenario: Create user and get JWT token
    Given Send request for create user and get token
    Then  Response status 200

  Scenario Outline: 1 New folder in root folder
    Given User send request for create folder in root folder with name <Name> from list
    Then Response status 201
    Examples: Folder's Name
      | Name                 |
      | F                    |
#      | Folder-1             |
#      | folder2              |
#      | FOLDER 3             |
#      | Folder12345678901234 |
#      | Папка                |
#      | 資料夾                |

#  Scenario Outline 2: Create new  folder in user's folder (as owner)
#    Given The user is created folder in root folder
#    And Open this folder
#    When The user press "Create a new folder" button
#    And The field name <Name> is filled by user from list of folder name
#    Then The folder is created
#    And The user becomes the owner of this folder
#    Examples: Folder's Name
#      | Name                 |
#      | F                    |
#      | Folder-1             |
#      | folder2              |
#      | FOLDER 3             |
#      | Folder12345678901234 |
#      | Папка                |
#      | 資料夾                |

#  Scenario: 3 User can not create folder without name
#    Given The user is located in his root folder
#    When The user press Create a new folder button
#    And The field name is empty
#    Then The folder is NOT created
#    And error message is shown
#
#  Scenario Outline: 4 User can not create folder with name more than 20 characters 
#    Given  The user is located in his root folder
#    When  The user press "Create a new folder" button
#    And  The field invalid name <invalidName> is filled by user from list of folder name
#    Then  The folder is NOT created
#    And  error message is shown
#
#    Examples: Invalid Name
#      | invalidName                                                  |
#      | 123456789012345678901                                        |
#      | ABCDEABCDEABCDEABCDEABCDE                                    |
#      | !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! |








