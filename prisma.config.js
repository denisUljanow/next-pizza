const path = require('path');
const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed: `node ${path.join(__dirname, 'prisma', 'seed.js')}`,
  },
});
