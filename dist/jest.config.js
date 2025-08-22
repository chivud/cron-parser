"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    verbose: true,
    testEnvironment: "node",
    coverageDirectory: "coverage",
    collectCoverageFrom: ["index.ts"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
};
exports.default = config;
