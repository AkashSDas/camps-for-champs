describe("Logout", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    describe("when a user is logged in", () => {
        beforeEach(() => {
            cy.get("[data-test='login-button']").click();
            cy.get("[data-test='login-email-input']").type("akash@gmail.com");
            cy.get("[data-test='login-password-input']").type("Testing123");
            cy.get("[data-test='login-form']").submit();
        });

        it("should logout successfully", () => {
            cy.get("[data-test='profile-image']")
                .should("be.visible")
                .click()
                .then(() => {
                    cy.get("[data-test='logout-button']")
                        .should("be.visible")
                        .click();
                });
        });
    });

    describe("when a user is not logged in", () => {
        it("should not contain the user profile pic in navbar", () => {
            cy.get("[data-test='profile-image']").should("not.exist");
        });
    });
});
