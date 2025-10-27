const { Pool } = require("pg");
const app = require("./app");
const config = require("./config/config");

let server;

// Tạo kết nối tới PostgreSQL
const pool = new Pool({
  user: config.pg.user,
  password: config.pg.password,
  host: config.pg.host || "localhost",
  port: config.pg.port || 5432,
  database: config.pg.database,
  ssl: config.pg.ssl || false, // nếu chạy local, nên để false
});

// Kiểm tra kết nối DB và khởi động server
(async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL successfully");

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL:", error.message);
    process.exit(1);
  }
})();

// Xử lý dừng server an toàn
const exitHandler = async () => {
  if (server) {
    console.log("🛑 Closing server...");
    server.close(async () => {
      try {
        await pool.end();
        console.log("✅ Database connection pool closed");
      } catch (err) {
        console.error("⚠️ Error closing database pool:", err.message);
      }
      console.log("🛑 Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = error => {
  console.error("Unexpected error:", error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) server.close();
});
