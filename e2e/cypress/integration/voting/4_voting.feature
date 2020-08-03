@test_case_4.4
@remove_users_from_voting
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_4.4'

Feature: Voting
  As a user (any role), I want to vote for any available file, so that my vote will be counting

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
    And The user send request for upload file "mockTest.txt"
    And The user send request for updating file "mockTest.txt"
    And The "User1" sends a request to grant "edit" access to the "file" "mockTest.txt" to "User2"

  Scenario: 1 Owner can vote
    And User send request for create voting with 2 answers for a file "mockTest.txt" and description "true"
    And Response status 201
    When "User1" send a request to vote for the "Yes" variant for "mockTest.txt" file
    Then Response status 200
    And Vote "Yes" of "User1" was accepted

  Scenario: 2 Editor can vote
    And User send request for create voting with 2 answers for a file "mockTest.txt" and description "true"
    And Response status 201
    When "User2" send a request to vote for the "Yes" variant for "mockTest.txt" file
    Then Response status 200
    And Vote "Yes" of "User2" was accepted

  Scenario: 3 Viewer can vote
    Given The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User2"
    And User send request for create voting with 2 answers for a file "mockTest.txt" and description "true"
    And Response status 201
    When "User2" send a request to vote for the "Yes" variant for "mockTest.txt" file
    Then Response status 200
    And Vote "Yes" of "User2" was accepted

  Scenario Outline: 4 User as owner/editor/viewer can't re-vote
    Given Send request for create user3 and get token
    And The "User1" sends a request to grant "view" access to the "file" "mockTest.txt" to "User3"
    And User send request for create voting with 2 answers for a file "mockTest.txt" and description "true"
    And Response status 201
    When "<user>" send a request to vote for the "Yes" variant for "mockTest.txt" file
    And Response status 200
    And Vote "Yes" of "<user>" was accepted
    And "<user>" send a request to vote for the "No" variant for "mockTest.txt" file
    Then Response status 409
    And Message "You have already voted in this vote"
    Examples:
      | user  |
      | User1 |
      | User2 |
      | User3 |

  Scenario Outline: 5 User can't vote with <token> token
    And User send request for create voting with 2 answers for a file "mockTest.txt" and description "true"
    And Response status 201
    When "User2" send a request to vote for the "Yes" variant for "mockTest.txt" file "<token>" token
    Then Response status 203
    And Message "Not Authorized"
    Examples:
      | token     |
      | without   |
      | incorrect |

  Scenario: 6 User can't vote for non-exist variant
    And User send request for create voting with 2 answers for a file "mockTest.txt" and description "true"
    And Response status 201
    When "User2" send a request to vote for the "Incorrect variant" variant for "mockTest.txt" file
    Then Response status 422
    And Message "Variant does not exist"

  Scenario: 7 User can't vote without permissions for a file
    Given Send request for create user3 and get token
    And User send request for create voting with 2 answers for a file "mockTest.txt" and description "true"
    And Response status 201
    When "User3" send a request to vote for the "Yes" variant for "mockTest.txt" file
    Then Response status 403
    And Message "User does not have permission"

#  Scenario: 8 user can't vote in non-existent vote
#    When "User2" send a request to vote for the "Yes" variant for "khbgspdofvdpf.txt" file
#    Then Response status 422
#    And Message "Variant does not exist"
