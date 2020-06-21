@test_case_2.7
@viewing_previous_versions
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.7'

Feature:  Viewing previous version
  As a user (any role), I want to see any available version so that I can check what was changed.

  Rule: user should be registered.

    Scenario: Create user and upload file with 2 versions
      Given Send request for create user and get token
      And The user send request for upload file "TestUpload.txt"
      And The user send request for updating file "TestUpload.txt"
      And Send request for list of the previous versions of "TestUpload.txt" file

    Scenario: 1 Viewing previous version
      Given The user send request for viewing previous version "TestUpload.txt" file
      Then Response status 200

    Scenario: 2 User can not get previous version with incorrect bearer
      When The user send request for viewing previous version with incorrect bearer
      Then Response status 203

    Scenario: 3 User can not get previous version bearer is empty
      When The user send request for viewing previous version bearer is empty
      Then Response status 203

    Scenario: 4 User can not get previous version with incorrect hash
      When The user send request for viewing previous version with incorrect hash
      Then Response status 404