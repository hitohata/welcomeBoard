import { Config } from "jest";

const config: Config = {
  verbose: true,
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    }
}

export default config;
