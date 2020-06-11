@test_case_2.5
@files_view
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.5'

Feature:  File updating
  As an owner or editor, I want to update the file so that the correct version could be used.

  Rule: user should be registered.

    Scenario: Create user and get JWT token
      Given Send request for create user and get token
      And The user send request for upload file "TestUpload.txt"

    Scenario: 1 File updating
      When The user send request for updating file "TestUpload.txt"
      Then Response status 200

    Scenario: 2 User can not update file with incorrect bearer
      When The user send request for updating file "TestUpload.txt" with incorrect bearer
      Then Response status 203

    Scenario: 3 User can not update file if bearer is empty
      When The user send request for updating file "TestUpload.txt" and bearer is empty
      Then Response status 203

    Scenario: 4 User can not update file if the file is not exist
      When The user send request for updating file "TestUpload.txt" if the file is not exist
      Then Response status 404

    Scenario: 5 User can not update file if the file is invalid
      When The user send request for updating file "TestUpload.txt" if the file is invalid
      Then Response status 400

