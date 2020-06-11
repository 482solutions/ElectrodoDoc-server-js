@api
@put
# ./node_modules/.bin/cypress-tags run -e TAGS='@'

Feature: Update user password
  Changing user credentials

  Scenario: Create user
    Given Send request for create user and get token
    Then Response status 200

  Scenario: Update password
    Given I send request for update password
    Then Response status 200

  Scenario: User can not update password without auth
    Given I send request for update password without Bearer
    Then Response status 203

  Scenario: User can not update password to empty new password
    Given I send request for update password to empty new password
    Then Response status 422

  Scenario: User can not update password to new password with spaces
    Given I send request for update password to new password with spaces
    Then Response status 422

  Scenario: New password and old password can not be the same
    Given I send request for update password update request with the same data
    Then Response status 422

  Scenario: User can not update password with invalid old password
    Given I send request for update password without old password
    Then Response status 422
