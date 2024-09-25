describe("Página Inicial", () => {
  it("Deve carregar a página principal com sucesso", () => {
    cy.visit("/");

    cy.get("h1").should("contain.text", "Divirta-se");
  });
});

describe("Página de Jogar", () => {
  it("Deve carregar a página de jogar corretamente", () => {
    cy.visit("/components/jogar/jogar.html");

    cy.get("#inputSaldo").should("be.visible");
    cy.get("#btnConfirmarSaldo").should("be.visible");
    cy.get("#btnVerPresentes").should("be.visible");
    cy.get("#play").should("be.visible");
  });
});

describe("Inserir saldo inicial e clicar em jogar", () => {
  it("Deve permitir inserir saldo inicial e clicar em jogar", () => {
    cy.visit("components/jogar/jogar.html");
    cy.get("#modalInputSaldo").should("be.visible");
    cy.get("#inputSaldo").type("100,00");
    cy.get("#btnConfirmarSaldo").click();
    cy.get("#modalInputSaldo").should("not.be.visible");
    cy.contains("#actualValue", "R$ 100,00");

    cy.get("#play").click();
  });
});

describe("Modal de Presentes", () => {
  it("Deve abrir e fechar o modal de presentes corretamente", () => {
    base(cy);

    cy.get("#btnVerPresentes").click();

    cy.get("#myModal").should("be.visible");

    cy.get(".close").click();

    cy.get("#myModal").should("not.be.visible");
  });
});

describe("Interação com Cartas de Jogo", () => {
  it("Deve exibir todas as cartas e permitir a interação", () => {
    base(cy);

    cy.get(".card").should("have.length", 3);
    cy.get("#card-img-1").should("be.visible").click();
    cy.get("#card-img-2").should("be.visible").click();
    cy.get("#card-img-3").should("be.visible").click();
  });
});

function base(cy) {
  cy.visit("components/jogar/jogar.html");
  cy.get("#modalInputSaldo").should("be.visible");
  cy.get("#inputSaldo").type("100,00");
  cy.get("#btnConfirmarSaldo").click();
  cy.get("#modalInputSaldo").should("not.be.visible");
  cy.contains("#actualValue", "R$ 100,00");

  cy.get("#play").click();
}
