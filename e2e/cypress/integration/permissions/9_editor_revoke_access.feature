@test_case_3.9
@editor_revoke_access

  # ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_3.9'

Feature: Editor revoke access
  As an editor of the file (folder), I want to have "Revoke access"
  functionality so that I can revoke access to the file or folder of any editor or viewer (except owner).

  Background:
    Given Send request for create user and get token
    And Send request for create user2 and get token
