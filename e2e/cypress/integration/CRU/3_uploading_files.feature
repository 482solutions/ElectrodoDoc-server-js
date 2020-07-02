@test_case_2.3
@uploading_folders
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.3'

Feature: Uploading files
  As an editor or owner of the folder, I want to upload a new file so that I can view, update or share it

  Rule: user should be registered.

    Scenario: Create user and get JWT token
      Given Send request for create user and get token

    Scenario: 1 User can upload png file
      When User send request for upload png file
      Then Response status 200

    Scenario: 2 User can upload txt file
      When The user send request for upload file "mockTest.txt"
      Then Response status 200

    Scenario: 3 User can not upload file without auth
      When User send request for upload file without auth
      Then Response status 203

    Scenario: 4 User can not upload file with incorrect token
      When User send request for upload file with incorrect token
      Then Response status 203

    Scenario: 5 User can not upload file with incorrect parentFolder
      When User send request for upload file with incorrect parentFolder
      Then Response status 404

    Scenario: 6 User can not upload file without parentFolder
      When User send request for upload file without parentFolder
      Then Response status 422

    Scenario: 7 User can not upload file without file name
      When User send request for upload file without file name
      Then Response status 422

    Scenario: 8 User can not upload file without file
      When User send request for upload file without file
      Then Response status 400

#  Scenario: 3 User can not upload file with the same name
#    Given The user is authorized
#    And the user is located in his root folder or in the  folder where he has "Editors" rights
#    When The user press Upload a new file button
#    And Choose the needed file from its PC directory with the same name as another file in this folder
#    Then The file is not uploaded
#    And The user gets error notification "The file with this name already exists."
#
#  Scenario: 4 User can not upload two files at the same time
#    Given The user is authorized
#    And the user is located in his root folder or in the  folder where he has "Editors" rights
#    When The user press Upload a new file button
#    And Choose two files from PC directory
#    Then The file is not uploaded
#    And The user gets error notification "The file with this name already exists."
