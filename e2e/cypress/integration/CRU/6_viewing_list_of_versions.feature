@test_case_2.6
@viewing_list_of_versions
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.6'

Feature:  Viewing previous version
  As a user (any role), I want to see a list of versions so that I can track the history of changes.

  Rule: user should be registered.

    Scenario: Create user and upload file with 2 versions
      Given Send request for create user and get token
      And The user send request for upload file "TestUpload.txt"
      And The user send request for updating file "TestUpload.txt"

    Scenario: 1 Get list of previous versions
      When Send request for list of the previous versions of "TestUpload.txt" file
      Then Response status 200
      And Response should contain 2 different cid
      And Response should contain time and user properties

    Scenario: 2 User can not get list with incorrect bearer
      When The user send request for list of previous version with incorrect bearer
      Then Response status 203

    Scenario: 3 User can not get list if bearer is empty
      When The user send request for list if bearer is empty
      Then Response status 203

    Scenario: 4 User can not get list with incorrect hash
      When The user send request for get list with incorrect hash
      Then Response status 404