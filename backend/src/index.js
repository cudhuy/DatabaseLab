const mssql = require("mssql");
const app = require("./app");
const config = require("./config/config");

let server;

const dbSettings = {
  user: config.sql.user,
  password: config.sql.password,
  server: "localhost",
  database: "TESTFINAL",
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

mssql.connect(dbSettings).then(() => {
  console.log("Connected to SQL Server successfully");
  server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = error => {
  console.log(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
