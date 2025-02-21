const fs = require('fs');

class StockManager {
    constructor() {
        this.stock = {};
        this.history = {};
        this.lowStockThreshold = 5;
        this.historyFile = 'historique-de-mon-stock.txt';
    }

    logHistory(name, action, quantity) {
        const entry = `${new Date().toISOString()} - ${name} - ${action} - ${quantity} unités\n`;
        fs.appendFileSync(this.historyFile, entry);
    }

    addItem(name, quantity) {
        if (typeof quantity !== 'number') {
            throw new Error("La quantité doit être un nombre.");
        }
        if (quantity < 0) {
            throw new Error("La quantité doit être un nombre positif.");
        }
        if (this.stock[name]) {
            throw new Error("L'article existe déjà.");
        }
        this.stock[name] = quantity;
        this.history[name] = [{ action: 'Ajout', quantity, date: new Date().toISOString() }];
        this.logHistory(name, 'Ajout', quantity);
    }

    checkItemExists(name) {
        return this.stock.hasOwnProperty(name);
    }

    getQuantity(name) {
        if (!this.stock.hasOwnProperty(name)) {
            throw new Error("L'article n'existe pas.");
        }
        return this.stock[name];
    }

    removeItem(name, quantity) {
        if (!this.stock.hasOwnProperty(name)) {
            throw new Error("L'article n'existe pas.");
        }
        if (typeof quantity !== 'number') {
            throw new Error("La quantité doit être un nombre.");
        }
        if (quantity < 0) {
            throw new Error("La quantité doit être un nombre positif.");
        }
        if (this.stock[name] < quantity) {
            throw new Error("Stock insuffisant.");
        }
        this.stock[name] -= quantity;
        this.history[name].push({ action: 'Retrait', quantity, date: new Date().toISOString() });
        this.logHistory(name, 'Retrait', quantity);

        if (this.stock[name] < this.lowStockThreshold) {
            console.warn(`Alerte : Le stock de ${name} est faible (${this.stock[name]} unités restantes).`);
        }
    }

    generateReport() {
        return Object.entries(this.stock).map(([name, quantity]) => ({ name, quantity }));
    }

    generateNonEmptyStockReport() {
        return Object.entries(this.stock)
            .filter(([_, quantity]) => quantity > 0)
            .map(([name, quantity]) => ({ name, quantity }));
    }

    generateEmptyStockReport() {
        return Object.entries(this.stock)
            .filter(([_, quantity]) => quantity === 0)
            .map(([name, quantity]) => ({ name, quantity }));
    }

    getHistory(name) {
        if (!this.history[name]) {
            throw new Error("L'article n'existe pas.");
        }
        return this.history[name];
    }

    exportHistoryToFile() {
        let content = '';
        for (const [name, entries] of Object.entries(this.history)) {
            content += `Article : ${name}\n`;
            entries.forEach(entry => {
                content += `${entry.date} - ${entry.action} - ${entry.quantity} unités\n`;
            });
            content += '\n';
        }
        fs.writeFileSync(this.historyFile, content);
    }
}

module.exports = StockManager;
