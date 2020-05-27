#@test_case_2.6
#@viewing_list_of_versions
## ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.6'
#
#Feature:  Viewing previous version
#  As a user (any role), I want to see a list of versions so that I can track the history of changes.

#  Background: Register new user
#    Given Register new user
#    And Login as new user
#    When The user locate on dashboard
#    And Upload file "test_positive"
#    Then The user updating file
#    And Upload new version of file
#
#  Scenario: 1 Viewing list of versions
#
#    Given The user has access to the file with any type of rights
#    When user press the "Actions_хешфайла" button
#    The user press the "Previous versions" button (id Versions_хешфайла)
#    Then The user sees the pop-up (VersionsModal) with the list of available versions (CID_(cid))and the time(Time_(cid)), date when the version was created
#  And button "Download" (Download_(cid))
#  And button close pop-up (CloseVersionsModal) is visible

