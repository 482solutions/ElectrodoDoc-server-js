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

    Scenario Outline: New folder in root folder
      Given User send request for create folder in root folder with name <Name> from list
      Then Response status 201
      Examples: Folder's Name
        | Name                 |
        | F                    |
        | Folder-1             |
        | folder2              |
        | FOLDER 3             |
        | Folder12345678901234 |
        | Папка                |
        | 資料夾                  |

    Scenario: User can create folder in users's folder
      Given User send request for create folder in user's folder with name "F"
      Then Response status 201
#
    Scenario Outline: User cannot create folder with existing name
      Given User send request for create folder in root folder with existing name <existingName> from list
      Then Response status 409
      Examples: Folder's Name
        | existingName         |
        | F                    |
        | Folder-1             |
        | folder2              |
        | FOLDER 3             |
        | Folder12345678901234 |
        | Папка                |
        | 資料夾                  |

    Scenario: User can not create folder with spaces in folders name
      Given User send request for create folder with spaces in folders name
      Then Response status 422

    Scenario: User can not create folder without name
      Given User send request for create folder in root folder without name
      Then Response status 422

    Scenario Outline: User can not create folder with name more than 64 characters and more
      Given User send request for create folder in root folder with name <bigName> from list than 64 characters and more
      Then Response status 422
      Examples: Big Name
        | bigName                                                                     |
        | 12345678901234567890112345678901234567890112345678901234567890123           |
        | ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE |
        | !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! |

    Scenario: User can not create folder without auth
      Given User send request for create folder without auth
      Then Response status 203
