module.exports = {
  roots: ["<rootDir>/src"],
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  transform: {
    ".+\\.ts$": "ts-jest"
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1"
  }
}

