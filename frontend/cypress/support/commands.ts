/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

export {};

declare global {
    namespace Cypress {
        interface Chainable<Subject = any> {
            getData(attribute: string): Chainable<JQuery>;
            interceptApisForSuccessfulInitialLogin(): void;
        }
    }
}

Cypress.Commands.add("getData", (attribute: string) => {
    return cy.get(`[data-test=${attribute}]`);
});

Cypress.Commands.add("interceptApisForSuccessfulInitialLogin", () => {
    // cy.intercept("/api/users/login/").as("api");
    cy.intercept("/api/users/login", { fixture: "login" }).as("loginApi");
    cy.intercept("/api/users/login/refresh", {
        fixture: "refresh-access-token",
    }).as("refreshApi");
    cy.intercept("/api/users/me", {
        fixture: "user-info",
    }).as("loggedInUserInfo");
    cy.intercept("/api/camps/likes/user", {
        fixture: "liked-camps",
    }).as("likedCamps");
});
