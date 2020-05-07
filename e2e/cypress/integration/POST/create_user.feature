@api
@post
# ./node_modules/.bin/cypress-tags run -e TAGS='@'

Feature: Create user
  After registration user receive Certificate for Fabric CA

#  login
#  email
#  password
#  csr.txt

  @positive
  Scenario: Create user
    Given I send request for "POST" user
#    Then I got response status 201
#    And Description "Certificate"
#    Then There is no token

#  @positive
#  Scenario: Username can contain 2 uppercase letters
#    Given I send request for POST user with username that contain 2 uppercase letters
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain 2 lowercase letters
#    Given I send request for POST user with username that contain 2 lowercase letters
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain 20 uppercase letters
#    Given I send request for POST user with username that contain 20 uppercase letters
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain 20 lowercase letters
#    Given I send request for POST user with username that contain 20 lowercase letters
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain 3 uppercase letters
#    Given I send request for POST user with username that contain 3 uppercase letters
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain 3 lowercase letters
#    Given I send request for POST user with username that contain 3 lowercase letters
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain 19 uppercase letters
#    Given I send request for POST user with username that contain 19 uppercase letters
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain 19 lowercase letters
#    Given I send request for POST user with username that contain 19 lowercase letters
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain only numbers
#    Given I send request for POST user with username that contain only numbers
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain letters in uppercase, lowercase and number
#    Given I send request for POST user with username that contain letters in uppercase, lowercase and number
#    Then I got response status 201
#
#  @positive
#  Scenario: Username can contain 2 words with uppercase and lowercase
#    Given I send request for POST user with username that contain 2 words with uppercase and lowercase
#    Then I got response status 201
#
#  @negative @BAG
#  Scenario: Username can not contain only 1 letter
#    Given I send request for POST user with username that contain only 1 letter
##    TODO: BAG
##    Then I got response status 422
#
#  @negative @BAG
#  Scenario: Username can not contain 21 characters
#    Given I send request for POST user with username that contain 21 characters
##    TODO: BAG
##    Then I got response status 422
#
#  @negative
#  Scenario: User cannot register again
#    Given I send a request for "POST" user twice
#    Then I got response status 409
##    And Error "User already exist"
#
#  @negative
#  Scenario: User cannot register without login
#    Given I send request for POST user without login
#    Then I got response status 422
#    And Error Required Username
##
#  @negative
#  Scenario: User cannot register without password
#    Given I send request for POST user without password
#    Then I got response status 422
#    And Error Required Password
#
#  @negative
#  Scenario: User cannot register without email
#    Given I send request for POST user without email
#    Then I got response status 422
#    And Error Required Email
#
#  @negative
#  Scenario: User cannot register  with login in field email
#    Given I send request for POST user with login in field email
#    Then I got response status 422
#    And Error Invalid Email
#
#  @negative
#  Scenario: User cannot register with email in field login
#    Given I send request for POST user with email in field login
#    #    TODO: BAG
##    Then I got response status 422
##    And Error Invalid Email
#
#  @negative
#  Scenario: Username can not contain only spaces
#    Given I send request for POST user with username that contain only spaces
#    Then I got response status 422
#
#  @negative @email
#  Scenario: Email can not contain 2 characters @@
#    Given I send request for POST user with email that contain 2 @@
#    Then I got response status 422
#
##  @negative @email @BAG
##  Scenario: User can not register email without domain name
##    Given I send request for POST user with email that not contain domain name
##    Then I got response status 422
#
#  @negative @password # TODO желательно изменить ответ на беке 409 -> 422
#  Scenario: Password can not contain 101 characters
#    Given I send request for POST user with password that contain 101 characters
##    Then I got response status 409
#
#  @positive @password
#  Scenario: Password can contain 100 characters
#    Given I send request for POST user with password that contain 100 characters
#    Then I got response status 201

#////////////////////////////////////////////////////////////////////////////////////////////////////////

#  @negative
#  Scenario: (POST) user cannot register without csr
#    Given I send request for POST user without csr
#    Then I got response status 422
#    And Description "Invalid user data"
#
#


