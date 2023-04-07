// Get connection to the database
const db = require("./db.js");
const uuid = require('uuid');

class Document {

    constructor(name, content, savedByUserId, id = null) {
        if (id == null) {
            this.id = uuid.v1();
        }
        else {
            this.id = id;
        }
        this.name = name;
        this.content = content;
        this.savedByUserId = savedByUserId;
    }

    static getAllByUserId(userId, callback) {
        db.query('SELECT * FROM documents WHERE savedByUserId = ?', [userId], (error, results) => {
            if (error) throw error;

            const documents = [];

            results.forEach(result => {
                const { id, name, content, savedByUserId } = result;
                const document = new Document(name, content, savedByUserId, id);
                documents.push(document);
            });
            callback(documents);
        });
    }

    static getById(id, callback) {
        db.query('SELECT * FROM documents WHERE id = ?', [id], (error, results) => {
            if (error) throw error;

            if (results.length) {
                const { id, name, content, savedByUserId } = results[0];
                const document = new Document(name, content, savedByUserId, id);
                callback(document);
            } else {
                callback(null);
            }
        });
    }

    static create(document, callback) {
        db.query('INSERT INTO `documents`(`id`, `name`, `content`, `savedByUserId`) VALUES (?, ?, ?, ?)', [document.id, document.name, document.content, document.savedByUserId], (error, result) => {
            if (error) throw error;

            callback(document);
        });
    }

    static delete(id, callback) {
        const query = 'DELETE FROM documents WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;

            callback(result.affectedRows);
        });
    }
}

// Export the Document model
module.exports = Document;
