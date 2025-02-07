const StockManager = require('../stockManager');

let stockManager;

beforeEach(() => {
  stockManager = new StockManager();
});

describe('Ajout darticle', () => {

  test("Ajouter un nouvel article", () => {
    const nouvelArticle = { name: "Matelas", quantity: 50 };
    stockManager.addItem(nouvelArticle.name, nouvelArticle.quantity);
    expect(stockManager.getQuantity(nouvelArticle.name)).toBe(nouvelArticle.quantity);
  });

  test("Ne pas ajouter un article existant", () => {
    const articleExistant = { name: "Matelas", quantity: 50 };
    stockManager.addItem(articleExistant.name, articleExistant.quantity);
    expect(() => stockManager.addItem(articleExistant.name, 30)).toThrow("L'article existe déjà.");
  });
});

describe('Consultation du stock', () => {
  test("Voir la quantité d'un article existant", () => {
    const article = { name: "Chaise", quantity: 30 };
    stockManager.addItem(article.name, article.quantity);
    expect(stockManager.getQuantity(article.name)).toBe(article.quantity);
  });

  test("Voir la quantité d'un article inexistant", () => {
    const articleInexistant = { name: "Table" };
    expect(() => stockManager.getQuantity(articleInexistant.name)).toThrow("L'article n'existe pas.");
  });
});

describe('Retrait dun article', () => {
  test("Retirer une quantité disponible", () => {
    const article = { name: "Canapé", quantity: 20 };
    const quantiteRetrait = 10;
    stockManager.addItem(article.name, article.quantity);
    stockManager.removeItem(article.name, quantiteRetrait);
    expect(stockManager.getQuantity(article.name)).toBe(article.quantity - quantiteRetrait);
  });

  test("Ne pas retirer plus que le stock disponible", () => {
    const article = { name: "Armoire", quantity: 5 };
    const quantiteRetrait = 10;
    stockManager.addItem(article.name, article.quantity);
    expect(() => stockManager.removeItem(article.name, quantiteRetrait)).toThrow("Stock insuffisant.");
  });
});


