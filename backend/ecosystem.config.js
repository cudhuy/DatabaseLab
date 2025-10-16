module.exports = {
  apps: [
    {
      name: "tinkerbellgarden",
      script: "src/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
