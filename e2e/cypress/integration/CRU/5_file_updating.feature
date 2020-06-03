@test_case_2.5
@files_view
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.5'

Feature:  File updating
  As an owner or editor, I want to update the file so that the correct version could be used.

  Rule: user should be registered.

    Scenario: Create user and get JWT token
      Given Send request for create user for updating file
      And The user send request for upload file "TestUpload.txt"

    Scenario: 1 File updating
      When The user send request for updating file "TestUpload.txt"
      Then Response status 200 updating

    Scenario: 2 User can not update file with incorrect bearer
      When The user send request for updating file "TestUpload.txt" with incorrect bearer
      Then Response status 203 updating

    Scenario: 3 User can not update file if auth is empty
      When The user send request for updating file "TestUpload.txt" and bearer is empty
      Then Response status 203 updating

    Scenario: 4 User can not update file if the file is not exist
      When The user send request for updating file "TestUpload.txt" if the file is not exist
      Then Response status 404 updating

    Scenario: 5 User can not update file if the file is invalid
        #hash = 4 invalid
      When The user send request for updating file "TestUpload.txt" if the file is invalid
      Then Response status 422 updating



#    put:
#    - "multipart/form-data"

#    parameters:
#    - name: "hash"
#    in: "formData"
#    required: true
#    type: "string"

#    - name: "file"
#    in: "formData"
#    description: "File to upload."
#    required: true
#    type: "file"

#    responses:
#    "200":
#    description: "Updated folder with this file"
#    "203":
#    description: "Not Authorized"
#    "404":
#    description: "Folder not exist" //hash = 64 invalid
#    "422":
#    description: "Invalid file hash supplied" //hash = 4 symbols
#    security:
#    - Bearer: []