@test_case_2.4
@files_view
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.4'

Feature: Files view
  As a user (any role), I want to view the available file so that I can use it

  Rule: user should be registered.

    Scenario: Create user and get JWT token
      Given Send request for create user for viewing file
      When The user send request for upload file

    Scenario: 1 File view
      When User sends a request for a file from the root folder
      Then Response status 200 file view

    Scenario: 2 User can not send request to view file without auth
      When User sends a request for a file from the root folder without auth
      Then Response status 203 file view

    Scenario: 3 User can not send request to view file with empty auth
      When User sends a request for a file from the root folder with empty auth
      Then Response status 203 file view

    Scenario: 4 User can not get file by incorrect hash
      When User sends a request for a file by incorrect hash
      Then Response status 404 file view

    Scenario: 5 User can not get file without hash
      When User sends a request for a file without hash
      Then Response status 404 file view

