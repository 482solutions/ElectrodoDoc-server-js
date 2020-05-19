#@test_case_2.4
#@files_view
## ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.4'
#
#Feature: Files view
#  As a user (any role), I want to view the available file so that I can use it

#  Background: Register new user
#    Given The application is opened
#    And there is no open session
#    When Register new user
#    And Login as new user
#    Then The user locate on dashboard
#    And The user press Upload a new file button
#    And Choose the needed file from its PC directory
#    And The file is uploaded
#
#  Scenario: 1 File view
#    Given The user located on root dashboard
#    And the user has access to any available file
#    When The user double click the file
#    Then The file is downloaded

#  (проверить то, что файл содержит те же данные)
#  cy.download().should('include', '') - get certificate
#
#  cy.get('.certificate-card-content').should('be.visible').then(() => {
#            cy.downloadFile(
#                basicURL + randomName + '/download',
#                '../Downloads',
#                'cert.pem',
#            ).readFile('../Downloads/cert.pem')
#                .should('include', '')
#        });
