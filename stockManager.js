class StockManager {
    constructor() {
        this.stock = {};
    }

    addItem(name, quantity) {
        if (this.stock[name]) {
            throw new Error("L'article existe déjà.");
        }
        this.stock[name] = quantity;
    }

    getQuantity(name) {
        if (!this.stock[name]) {
            throw new Error("L'article n'existe pas.");
        }
        return this.stock[name];
    }

    removeItem(name, quantity) {
        if (!this.stock[name]) {
            throw new Error("L'article n'existe pas.");
        }
        if (this.stock[name] < quantity) {
            throw new Error("Stock insuffisant.");
        }
        this.stock[name] -= quantity;
    }

}

module.exports = StockManager;
