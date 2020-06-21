@test_case_2.4
@files_view
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.4'

Feature: Files view
  As a user (any role), I want to view the available file so that I can use it

  Rule: user should be registered.

    Scenario: Create user and get JWT token
      Given Send request for create user and get token
      When The user send request for upload file "mockTest.txt"
      Then Response status 200

    Scenario: 1 File view
      When User sends a request for a file from the root folder
      Then Response status 200

    Scenario: 2 User can not send request to view file with incorrect cid
      When User sends a request for a file from the root folder with incorrect cid
      Then Response status 404

    Scenario: 3 User can not send request to view file with empty auth
      When User sends a request for a file from the root folder with empty auth
      Then Response status 203

    Scenario: 4 User can not get file by incorrect hash
      When User sends a request for a file by incorrect hash
      Then Response status 404

    Scenario: 5 User can not get file without hash
      When User sends a request for a file without hash
      Then Response status 404

