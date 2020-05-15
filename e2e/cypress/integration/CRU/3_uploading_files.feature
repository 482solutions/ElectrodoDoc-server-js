@test_case_2.3
@uploading_folders
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.3'

Feature: Uploading files
  As an editor or owner of the folder, I want to upload a new file so that I can view, update or share it

  Rule: user should be registered.
    #  Before('Register new user, sign in', function () {});

  Scenario: 1 New file
    Given The user is authorized
    And the user is located in his root folder or in the  folder where he has "Editors" rights
    When The user press Upload a new file button
    And Choose the needed file from its PC directory
    Then The file is uploaded
    And The user is the owner of this file

  Scenario: 2 User can not upload file with the same name
    Given The user is authorized
    And the user is located in his root folder or in the  folder where he has "Editors" rights
    When The user press Upload a new file button
    And Choose the needed file from its PC directory with the same name as another file in this folder
    Then The file is not uploaded
    And The user gets error notification "The file with this name already exists."

  Scenario: 3 User can not upload two files at the same time
    Given The user is authorized
    And the user is located in his root folder or in the  folder where he has "Editors" rights
    When The user press Upload a new file button
    And Choose two files from PC directory
    Then The file is not uploaded
    And The user gets error notification "The file with this name already exists."
