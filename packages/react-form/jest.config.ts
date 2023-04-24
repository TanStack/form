export default {
  displayName: 'react-form',
  preset: '../../jest-preset.js',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.tsx', '<rootDir>/codemods/**/*.test.js'],
}
