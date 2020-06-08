@api
@put
# ./node_modules/.bin/cypress-tags run -e TAGS='@'

Feature: Update user password
  Changing user credentials

  Scenario: Create user
    Given I send request for create new user and getting JWT token
    When I got response status 201 in update
    Then I send request for getting JWT token
    And I got response status 200 in update

  Scenario: Update password
    Given I send request for update password
    Then I got response status 200 in update

  Scenario: User can not update password without auth
    Given I send request for update password without Bearer
#    TODO: change response status on the backend
#    Then I got response status 203 in update

  Scenario: User can not update password to empty new password
    Given I send request for update password to empty new password
    Then I got response status 422 in update

  Scenario: New password and old password can not be the same
    Given I send request for update password update request with the same data
    Then I got response status 422 in update

  Scenario: User can not update password with invalid old password
    Given I send request for update password without old password
    Then I got response status 422 in update
