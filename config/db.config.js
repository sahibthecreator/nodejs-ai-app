module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "qwerty",
  DB: "ai-app",
  PORT: "8080",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};