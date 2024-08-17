describe("Login", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    describe("when a user is not logged in", () => {
        it("should contain login button", () => {
            cy.get("[data-test='login-button']").should("be.visible");
        });

        it("should open login modal form when login button is clicked", () => {
            cy.get("[data-test='login-button']").click();
            cy.get("[data-test='login-modal']").should("be.visible");
            cy.get("[data-test='login-form']").should("be.visible");
            cy.get("[data-test='login-email-input']").should("be.visible");
            cy.get("[data-test='login-password-input']").should("be.visible");
            cy.get("[data-test='login-submit-button']").should("be.visible");
        });

        it("should show error message when login form is submitted with invalid data", () => {
            cy.getData("login-button").click();
            cy.getData("login-form").submit();

            cy.get("[data-test='login-email-input'] > .helper-text").should(
                "be.visible"
            );
            cy.get("[data-test='login-password-input'] > .helper-text").should(
                "be.visible"
            );
        });

        it("should show error message when login form is submitted with invalid email", () => {
            cy.get("[data-test='login-button']").click();
            cy.get("[data-test='login-email-input']").type("invalid-email");
            cy.get("[data-test='login-form']").submit();
            cy.get("[data-test='login-email-input'] > .helper-text").should(
                "have.text",
                "Invalid email"
            );
        });

        // it.only("should show error when password is not provided", () => {
        //     // For HTML required and other validation messages

        //     cy.get("[data-test='login-button']").click();
        //     cy.get("[data-test='login-email-input']").type(
        //         "valid@email.com{enter}"
        //     );

        //     cy.get("[data-test='login-password-input']:invalid");

        //     cy.get("[data-test='login-password-input']:invalid")
        //         .invoke("prop", "validationMessage")
        //         .should("contain", "Please fill in this field.");

        //     cy.get("[data-test='login-password-input']:invalid")
        //         .invoke("prop", "validity")
        //         .its("valueMissing")
        //         .should("be.true");
        // });

        it("should submit login form successfully", () => {
            cy.get("[data-test='login-button']").click();
            cy.get("[data-test='login-email-input']").type("akash@gmail.com");
            cy.get("[data-test='login-password-input']").type("Testing123");
            cy.get("[data-test='login-form']").submit();
        });
    });
});
