import { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["index.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

export default config;
