// Get connection to the database
const db = require("./db.js");

class User {

    constructor(fullName, username, email, password, profilePicture, id = null) {
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profilePicture = profilePicture;
        this.id = id;
    }


    setId(id) {
        this.id = id;
    }

    static getById(id, callback) {
        db.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
            if (error) throw error;

            if (results.length) {
                const { id, fullName, username, email, password, profilePicture } = results[0];
                const user = new User(fullName, username, email, password, profilePicture, id);
                callback(user);
            } else {
                callback(null);
            }
        });
    }

    static getByUsername(username, callback) {
        db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
            if (error) throw error;

            if (results.length) {
                const { id, fullName, username, email, password, profilePicture } = results[0];
                const user = new User(fullName, username, email, password, profilePicture, id);
                callback(user);
            } else {
                callback(null);
            }
        });
    }

    static getByEmail(email, callback) {
        db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
            if (error) throw error;

            if (results.length) {
                const { id, fullName, username, email, password, profilePicture } = results[0];
                const user = new User(fullName, username, email, password, profilePicture, id);
                callback(user);
            } else {
                callback(null);
            }
        });
    }

    static create(user, callback) {
        db.query('INSERT INTO `users`(`fullName`, `username`, `email`, `password`) VALUES (?, ?, ?, ?)', [user.fullName, user.username, user.email, user.password], (error, result) => {
            if (error) throw error;

            user.setId(result.insertId);
            callback(user);
        });
    }

    static update(user, callback) {
        db.query('UPDATE users SET ? WHERE id = ?', [user, user.id], (error, result) => {
            if (error) throw error;

            callback(user);
        });
    }

    static updateProfilePicture(id, fileName, callback) {
        db.query('UPDATE users SET profilePicture = ? WHERE id = ?', [fileName, id], (error, result) => {
            if (error) throw error;

            callback(result.affectedRows);
        });
    }

    static delete(id, callback) {
        // Run a SQL query to delete a user from the database
        const query = 'DELETE FROM users WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;

            // Pass the number of affected rows to the callback function
            callback(result.affectedRows);
        });
    }
}

// Export the User model
module.exports = User;
