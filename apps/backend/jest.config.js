/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Folder-folder yang akan diuji
  roots: ['<rootDir>/src'],
  // Pola file tes (cari file .test.ts atau .spec.ts)
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  // Transformasi untuk file TypeScript menggunakan ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // Bersihkan mock antar tes untuk isolasi
  clearMocks: true,
  // Kumpulkan informasi cakupan kode
  collectCoverage: true,
  // Direktori output untuk laporan cakupan
  coverageDirectory: 'coverage',
  // Provider cakupan kode
  coverageProvider: 'v8',
};

