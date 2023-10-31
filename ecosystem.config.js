module.exports = {
  apps: [
    {
      name: "matricula-online-front",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
};
