describe("Signup", () => {
    beforeEach(() => {
        cy.visit("/");

        cy.get("[data-test='signup-button']").as("openModalButton");
    });

    it("should contain signup button", () => {
        cy.get("@openModalButton").should("be.visible");
    });

    describe("when the modal is opened", () => {
        beforeEach(() => {
            cy.get("@openModalButton").click();

            cy.get("[data-test='signup-modal']").as("modal");
            cy.get("[data-test='signup-form']").as("form");
            cy.get("[data-test='signup-email-input']").as("emailInput");
            cy.get("[data-test='signup-firstname-input']").as("firstNameInput");
            cy.get("[data-test='signup-lastname-input']").as("lastNameInput");
            cy.get("[data-test='signup-password-input']").as("passwordInput");
            cy.get("[data-test='signup-submit-button']").as("formSubmitBtn");
        });

        it("should show signup form", () => {
            cy.get("@modal").should("be.visible");
            cy.get("@form").should("be.visible");
            cy.get("@emailInput").should("be.visible");
            cy.get("@firstNameInput").should("be.visible");
            cy.get("@lastNameInput").should("be.visible");
            cy.get("@passwordInput").should("be.visible");
            cy.get("@formSubmitBtn").should("be.visible");
        });

        it("should submit signup form successfully", () => {
            cy.get("@emailInput").type("akash@gmail.com");
            cy.get("@firstNameInput").type("Akash");
            cy.get("@lastNameInput").type("Das");
            cy.get("@passwordInput").type("Testing123");
            cy.get("@formSubmitBtn").click();
        });

        it("should show error message when signup form is submitted with invalid data", () => {
            cy.get("@emailInput").type("invalid-email");
            cy.get("@firstNameInput").type("Akash");
            cy.get("@lastNameInput").type("Das");
            cy.get("@passwordInput").type("Testing123");
            cy.get("@formSubmitBtn").click();

            cy.get("[data-test='signup-email-input'] > .helper-text").should(
                "be.visible"
            );
        });
    });
});
