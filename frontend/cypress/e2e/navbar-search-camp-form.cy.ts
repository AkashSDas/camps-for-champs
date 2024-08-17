describe("Navbar Search Camp Form", () => {
    describe("when user is on home page", () => {
        it("should not show search camps form", () => {
            cy.visit("/");
            cy.get("[data-test='search-camps-input-button']").should(
                "not.be.visible"
            );
        });
    });

    describe("when user is not on home page", () => {
        beforeEach(() => {
            cy.visit("/search");
            cy.get("[data-test='search-camps-input-button']").as("searchBtn");
        });

        it("should be visible", () => {
            cy.get("@searchBtn").should("be.visible");
        });

        it("should open search drawer when search button is clicked", () => {
            cy.get("@searchBtn").last().click();
            cy.get("[data-test='search-camps-drawer']").should("be.visible");
        });

        describe("when search drawer is opened", () => {
            beforeEach(() => {
                cy.get("@searchBtn").last().click();
                cy.get("[data-test='search-camps-drawer']").as("drawer");
            });
        });
    });
});
