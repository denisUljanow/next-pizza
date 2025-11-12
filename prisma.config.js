const path = require('path');
const { defineConfig } = require('prisma/config');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed: `node ${path.join(__dirname, 'prisma', 'seed.js')}`,
  },
});
