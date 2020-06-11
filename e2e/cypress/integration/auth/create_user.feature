@api
@post
# ./node_modules/.bin/cypress-tags run -e TAGS='@'

Feature: Create user
  As a user (any role), I want to sign up the system so that I can use it

  @positive
  Scenario: Create user
    Given I send request for create user
    Then Response status 201

  @positive
  Scenario: Username can contain 2 uppercase letters
    Given I send request for POST user with username that contain 2 uppercase letters
    Then Response status 201

  @positive
  Scenario: Username can contain 2 lowercase letters
    Given I send request for POST user with username that contain 2 lowercase letters
    Then Response status 201

  @positive
  Scenario: Username can contain 20 uppercase letters
    Given I send request for POST user with username that contain 20 uppercase letters
    Then Response status 201

  @positive
  Scenario: Username can contain 20 lowercase letters
    Given I send request for POST user with username that contain 20 lowercase letters
    Then Response status 201

  @positive
  Scenario: Username can contain 3 uppercase letters
    Given I send request for POST user with username that contain 3 uppercase letters
    Then Response status 201

  @positive
  Scenario: Username can contain 3 lowercase letters
    Given I send request for POST user with username that contain 3 lowercase letters
    Then Response status 201

  @positive
  Scenario: Username can contain 19 uppercase letters
    Given I send request for POST user with username that contain 19 uppercase letters
    Then Response status 201

  @positive
  Scenario: Username can contain 19 lowercase letters
    Given I send request for POST user with username that contain 19 lowercase letters
    Then Response status 201

  @positive
  Scenario: Username can contain only numbers
    Given I send request for POST user with username that contain only numbers
    Then Response status 201

  @positive
  Scenario: Username can contain letters in uppercase, lowercase and number
    Given I send request for POST user with username that contain letters in uppercase, lowercase and number
    Then Response status 201

  @positive
  Scenario: Username can contain 2 words with uppercase and lowercase
    Given I send request for POST user with username that contain 2 words with uppercase and lowercase
    Then Response status 422

  @negative
  Scenario: Username can not contain only 1 letter
    Given I send request for POST user with username that contain only 1 letter
    Then Response status 422

  @negative
  Scenario: Username can not contain 21 characters
    Given I send request for POST user with username that contain 21 characters
    Then Response status 422

  @negative
  Scenario: User cannot register again
    Given I send a request for "POST" user twice
    Then Response status 409

  @negative
  Scenario: User cannot register without login
    Given I send request for POST user without login
    Then Response status 422

  @negative
  Scenario: User cannot register without field login
    Given I send request for POST user without field login
    Then Response status 422

  @negative
  Scenario: User cannot register without password
    Given I send request for POST user without password
    Then Response status 422

  @negative
  Scenario: User cannot register without field password
    Given I send request for POST user without field password
    Then Response status 422

  @negative
  Scenario: User cannot register without email
    Given I send request for POST user without email
    Then Response status 422

  @negative
  Scenario: User cannot register without field email
    Given I send request for POST user without field email
    Then Response status 422

  @negative
  Scenario: User cannot register without csr
    Given I send request for POST user without csr
    Then Response status 422

  @negative
  Scenario: User cannot register  with login in field email
    Given I send request for POST user with login in field email
    Then Response status 422

  @negative
  Scenario: User cannot register with email in field login
    Given I send request for POST user with email in field login
    Then Response status 422

  @negative
  Scenario: Username can not contain only spaces
    Given I send request for POST user with username that contain only spaces
    Then Response status 422

  @negative
  Scenario: Email can not contain 2 characters @@
    Given I send request for POST user with email that contain 2 @@
    Then Response status 422

  @negative
  Scenario: Password can not contain 101 characters
    Given I send request for POST user with password that contain 101 characters
    Then Response status 422

  @positive
  Scenario: Password can contain 100 characters
    Given I send request for POST user with password that contain 100 characters
    Then Response status 422





