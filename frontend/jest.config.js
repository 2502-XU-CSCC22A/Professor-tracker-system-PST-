export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^../api/axios$': '<rootDir>/__mocks__/axisMock.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: [
    '**/__tests__/**/*.{js,jsx}',
    '**/*.{spec,test}.{js,jsx}',
  ],
};
