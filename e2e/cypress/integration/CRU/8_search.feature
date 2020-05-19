#@test_case_2.8
#@viewing_previous_versions
## ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.8'
#
#Feature:  Search of files and folders
#  As a user (any role), I want to have a search bar so that I can search any file or folder by its name.
#
#  Background: Register new user
#    Given Register new user
#    And Login as new user
#    When The user locate on dashboard
#    And Upload files "test1.txt", "test2.doc"
#    Then Create folder with name "testFolder"
#    And Folder should be visible on dashboard
#
#  Scenario: 1 Search file
#    Given The user is authorized
#    And Any page of the application is open
#    When The user types the name "test1" of a file or folder
#    And The user presses the search button
#    Then Search result is file "test1.txt"
#
#  Scenario: 2 Search file by characters in name
#    Given The user is authorized
#    And Any page of the application is open
#    When The user types the name "test" of a file or folder
#    And The user presses the search button
#    Then Search results are files "test1.txt" and "test2.doc"
#    And search result is folder with name "testFolder"
#
#  Scenario: 3 Search file by one character
#    Given The user is authorized
#    And Any page of the application is open
#    When The user types the name "1" of a file or folder
#    And The user presses the search button
#    Then Search result is files "test1"
#
#  Scenario: 4 Search file by format
#    Given The user is authorized
#    And Any page of the application is open
#    When The user types ".doc"
#    And The user presses the search button
#    Then Search result is files "test2.doc"
#
#  Scenario: 5 Search without characters in field
#    Given The user is authorized
#    And Any page of the application is open
#    When Search field is empty
#    Then Button Search not active
