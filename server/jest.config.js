/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  preset: 'ts-jest',
  testRegex: '\\.test\\.ts$',
  setupFiles: ['dotenv/config']
};
