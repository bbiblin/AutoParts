/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  // 👇 Usa entorno de Node.js (recomendado para backend)
  testEnvironment: "node",

  // 👇 Patrón para encontrar archivos de prueba
  testMatch: [
    "**/tests/**/*.test.js",          // tests en carpeta /tests
    "**/?(*.)+(spec|test).js"         // o cualquier archivo *.test.js o *.spec.js
  ],

  // 👇 Ignora node_modules
  testPathIgnorePatterns: ["/node_modules/"],

  // Opcional: muestra más información en consola
  verbose: true,
};

module.exports = config;
