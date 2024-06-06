describe('UV Measurement App', () => {
    it('should load the application', () => {
        cy.visit('/');
        cy.contains('UV Diagramm').should('be.visible');
    });

    it('should add data and display it', () => {
        cy.visit('/');
        cy.get('#distanceInput').type('50');
        cy.get('#valueInput').type('300');
        cy.get('#buttonSend').click();
        cy.contains('50').should('be.visible');
        cy.contains('300').should('be.visible');
    });

    it('should load average values', () => {
        cy.visit('/');
        cy.get('#switchGetMean').click();
        cy.contains('Durchschnitt').should('be.visible');
    });
});