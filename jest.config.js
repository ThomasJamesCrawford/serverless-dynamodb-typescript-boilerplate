const tsJest = require('ts-jest/jest-preset');
const dynamodbJest = require('@shelf/jest-dynamodb/jest-preset');

module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  roots: ['<rootDir>'],
  ...tsJest,
  ...dynamodbJest,
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
};
