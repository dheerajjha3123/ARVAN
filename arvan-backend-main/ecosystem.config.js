// ecosystem.config.js
export default {
  apps: [
    {
      name: "arvan-backend",
      script: "bash",
      args: "-lc \"prisma generate && NODE_ENV=production node dist/index.js\"",
    }
  ]
}
