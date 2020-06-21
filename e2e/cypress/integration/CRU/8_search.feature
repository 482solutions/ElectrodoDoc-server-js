@test_case_2.8
@viewing_previous_versions
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.8'

Feature:  Search of files and folders
  As a user (any role), I want to have a search bar so that I can search any file or folder by its name.
  Rule: user should be registered and has files in folders.

    Scenario: Create user and upload file to folder
      Given Send request for create user and get token
      When User send request for create folder "testFolder" in root folder
      And The user send request for upload new file to testFolder with name "mockTest.txt"

    Scenario Outline: 1 Search file
      When The user send request for search file by name from list <fileName>
      Then Response status 200
      Examples: fileName
        | fileName     |
        | mockTest.txt |
        | mockTest     |
        | mock         |
        | Test         |
        | .txt         |
        | t            |

    Scenario: 2 User can not search file without auth
      When Send request for for search file without auth
      Then Response status 203

    Scenario: 3 User can not search file with empty auth
      When Send request for for search file empty auth
      Then Response status 203
