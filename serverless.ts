import type { AWS } from "@serverless/typescript";
import {
  findUsers,
  createCompanyMainDB,
  findUsersByDatabaseAndRole,
  disableUser,
  createEvent,
  findEvents,
  deleteEvents,
} from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "ttp-lambdas",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "sa-east-1",
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      MONGO_URI: process.env.MONGO_URI,
      DB_NAME: process.env.DB_NAME,
      COLLECTION_NAME: process.env.COLLECTION_NAME,
      API_KEY: process.env.API_KEY,
    },
  },
  functions: {
    findUsers,
    createCompanyMainDB,
    findUsersByDatabaseAndRole,
    disableUser,
    createEvent,
    findEvents,
    deleteEvents,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
