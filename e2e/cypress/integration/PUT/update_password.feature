#put:

#summary: "Update user password"
#security:
#- ApiKeyAuth: []
#description: "Changing user credentials"
#operationId: "ChangeUser"
#produces:
#- "application/json"
#parameters:
#- in: "body"
#name: "body"
#required: true
#schema:
#type: "object"
#properties:
#oldPassword:
#type: "string"
#newPassword:
#type: "string"
#responses:
#"200":
#description: "Successfully"
#"401":
#description: "Unauthorized"
#"422":
#description: "Invalid entity"

@api
@put
# ./node_modules/.bin/cypress-tags run -e TAGS='@'

Feature: Update user password
  Changing user credentials

#  Scenario: Create user
#    Given I send request for create new user and getting JWT token
#    Then I got response status 201

  Scenario: Update password
    Given I send request for update password
    Then I got response status 201

