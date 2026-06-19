import type { Config } from "jest";
import nextJest from "next/jest.js";

// next/jest wires up the Next.js SWC transform (JSX/TS), CSS & image mocks,
// and loads next.config + .env into the test environment.
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Match the colocated tests in src/**/__tests__/.
  testMatch: ["**/?(*.)+(test|spec).[jt]s?(x)"],
  // Resolve the "@/..." path alias from tsconfig.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

// Exported as a function call so next/jest can load the (async) Next.js config.
export default createJestConfig(config);
