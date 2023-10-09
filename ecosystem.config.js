module.exports = {
  apps: [
    {
      name: "matricula-online-front",
      port: "3001",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
};
