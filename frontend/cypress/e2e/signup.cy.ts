describe("Signup", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    describe("when a user is not logged in", () => {
        it("should open signup modal form when signup button is clicked", () => {
            cy.get("[data-test='signup-button']").click();
            cy.get("[data-test='signup-modal']").should("be.visible");
            cy.get("[data-test='signup-form']").should("be.visible");
            cy.get("[data-test='signup-email-input']").should("be.visible");
            cy.get("[data-test='signup-firstname-input']").should("be.visible");
            cy.get("[data-test='signup-lastname-input']").should("be.visible");
            cy.get("[data-test='signup-password-input']").should("be.visible");
            cy.get("[data-test='signup-submit-button']").should("be.visible");
        });

        it("should show error message when signup form is submitted with invalid data", () => {
            cy.get("[data-test='signup-button']").click();
            cy.get("[data-test='signup-form']").submit();
            cy.get("[data-test='signup-email-input'] > .helper-text").should(
                "be.visible"
            );
            cy.get("[data-test='signup-password-input'] > .helper-text").should(
                "be.visible"
            );
        });

        it("should submit signup form successfully", () => {
            cy.get("[data-test='signup-button']").click();
            cy.get("[data-test='signup-email-input']").type("akash@gmail.com");
            cy.get("[data-test='signup-firstname-input']").type("Akash");
            cy.get("[data-test='signup-lastname-input']").type("Das");
            cy.get("[data-test='signup-password-input']").type("Testing123");
            cy.get("[data-test='signup-form']").submit();
        });
    });
});
