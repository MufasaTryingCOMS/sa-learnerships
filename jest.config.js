module.exports = {
    testEnvironment: 'node',

    collectCoverageFrom: [
        '**/*.js',

        // Exclude specific patterns
        '!**/node_modules/**',
        '!**/coverage/**',
        '!**/*.config.js',
        '!**/jest.config.js',
        '!**/app.js',
    ],

    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],

    // Builds fail if this threshold is not met
    coverageThreshold: {
        global: { branches: 0, functions: 0, lines: 0, statements: 80 },
    },

    coverageReporters: ['json-summary', 'text', 'text-summary', 'lcov', 'html', 'clover'], // Output formats for coverage reports
    coverageDirectory: 'coverage',
    passWithNoTests: true,
    testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/', '/build/'],
};
