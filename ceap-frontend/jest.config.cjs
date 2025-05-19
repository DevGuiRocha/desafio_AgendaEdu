// jest.config.cjs
module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.module\\.css$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js'
    ],
};
