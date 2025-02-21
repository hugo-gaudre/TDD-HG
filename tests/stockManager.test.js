const StockManager = require('../stockManager');

let stockManager;

beforeEach(() => {
    stockManager = new StockManager();
});

describe('Ajout darticle', () => {
    test("Ajouter un nouvel article et vérifier l'historique", () => {
        const nouvelArticle = { name: "Matelas", quantity: 50 };
        stockManager.addItem(nouvelArticle.name, nouvelArticle.quantity);
        expect(stockManager.getQuantity(nouvelArticle.name)).toBe(nouvelArticle.quantity);
        const history = stockManager.getHistory(nouvelArticle.name);
        expect(history[0].action).toBe('Ajout');
    });

    test("Ne pas ajouter un article existant", () => {
        stockManager.addItem("Matelas", 50);
        expect(() => stockManager.addItem("Matelas", 30)).toThrow("L'article existe déjà.");
    });

    test("Ajouter un article avec une quantité non numérique", () => {
        expect(() => stockManager.addItem("Matelas", 'a')).toThrow("La quantité doit être un nombre.");
    });

    test("Ajouter un article avec une quantité négative", () => {
        expect(() => stockManager.addItem("Chaise", -5)).toThrow("La quantité doit être un nombre positif.");
    });

    test("Vérifier si un article existe", () => {
        stockManager.addItem("Table", 10);
        expect(stockManager.checkItemExists("Table")).toBe(true);
        expect(stockManager.checkItemExists("Chaise")).toBe(false);
    });
});

describe('Consultation du stock', () => {
    test("Voir la quantité d'un article existant", () => {
        stockManager.addItem("Chaise", 30);
        expect(stockManager.getQuantity("Chaise")).toBe(30);
    });

    test("Voir la quantité d'un article inexistant", () => {
        expect(() => stockManager.getQuantity("Table")).toThrow("L'article n'existe pas.");
    });

    test("Historique d’un article inexistant", () => {
        expect(() => stockManager.getHistory("Canapé")).toThrow("L'article n'existe pas.");
    });
});

describe('Retrait dun article', () => {
    test("Retirer une quantité disponible et vérifier l'historique", () => {
        stockManager.addItem("Canapé", 20);
        stockManager.removeItem("Canapé", 10);
        expect(stockManager.getQuantity("Canapé")).toBe(10);
        const history = stockManager.getHistory("Canapé");
        expect(history[1].action).toBe('Retrait');
    });

    test("Afficher une alerte lorsque le stock devient faible", () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        stockManager.addItem("Armoire", 6);
        stockManager.removeItem("Armoire", 2);
        expect(consoleSpy).toHaveBeenCalledWith("Alerte : Le stock de Armoire est faible (4 unités restantes).");
        consoleSpy.mockRestore();
    });

    test("Ne pas retirer plus que le stock disponible", () => {
        stockManager.addItem("Armoire", 5);
        expect(() => stockManager.removeItem("Armoire", 10)).toThrow("Stock insuffisant.");
    });
});

describe('Rapport des stocks', () => {
    test("Générer un rapport avec tous les articles", () => {
        stockManager.addItem("Bureau", 15);
        stockManager.addItem("Étagère", 0);
        const report = stockManager.generateReport();
        expect(report).toContainEqual({ name: "Bureau", quantity: 15 });
        expect(report).toContainEqual({ name: "Étagère", quantity: 0 });
    });

    test("Générer un rapport avec uniquement les articles en stock", () => {
        stockManager.addItem("Bureau", 15);
        stockManager.addItem("Étagère", 0);
        const report = stockManager.generateNonEmptyStockReport();
        expect(report).toContainEqual({ name: "Bureau", quantity: 15 });
        expect(report).not.toContainEqual({ name: "Étagère", quantity: 0 });
    });

    test("Générer un rapport avec uniquement les articles épuisés", () => {
        stockManager.addItem("Bureau", 15);
        stockManager.addItem("Étagère", 0);
        const report = stockManager.generateEmptyStockReport();
        expect(report).toContainEqual({ name: "Étagère", quantity: 0 });
        expect(report).not.toContainEqual({ name: "Bureau", quantity: 15 });
    });

    test("Historique des mouvements pour tous les articles", () => {
        stockManager.addItem("Chaise", 30);
        stockManager.removeItem("Chaise", 5);
        stockManager.addItem("Table", 20);
        stockManager.removeItem("Table", 10);

        const chaiseHistory = stockManager.getHistory("Chaise");
        const tableHistory = stockManager.getHistory("Table");

        expect(chaiseHistory.length).toBe(2);
        expect(chaiseHistory[0].action).toBe('Ajout');
        expect(chaiseHistory[1].action).toBe('Retrait');

        expect(tableHistory.length).toBe(2);
        expect(tableHistory[0].action).toBe('Ajout');
        expect(tableHistory[1].action).toBe('Retrait');
    });
});
