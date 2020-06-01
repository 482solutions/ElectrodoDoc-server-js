@test_case_2.8
@viewing_previous_versions
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.8'

Feature:  Search of files and folders
  As a user (any role), I want to have a search bar so that I can search any file or folder by its name.
  Rule: user should be registered and has files in folders.

    Scenario: Create user and upload file to folder
      Given Send request for create user for search
      When User send request for create folder "testFolder" in root folder
      And The user send request for upload new file to testFolder with name "1file.png"

    Scenario Outline: 1 Search file
      When The user send request for search file by name from list <fileName>
      Then Response status 200 search
      Examples: fileName
        | fileName  |
        | 1file.png |
        | 1file     |
        | 1         |
        | file      |
        | .png      |

    Scenario Outline: 2 Search file by word in the uppercase
      When The user send request for search file by invalid name from list <nameToUpper>
      Then Response status 404 search
      Examples: nameToUpper
        | nameToUpper |
        | 1FILE.png   |
        | 1FILE       |
        | FILE        |
        | .PNG        |

    Scenario: 3 User can not search file without auth
      When Send request for for search file without auth
      Then Response status 203 search

    Scenario: 4 User can not search file with empty auth
      When Send request for for search file empty auth
      Then Response status 203 search
