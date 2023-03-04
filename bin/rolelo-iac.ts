#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { Cloudfront } from "../lib/cloudfront";
import { CognitoStack } from "../lib/cognito";
import { KubernetesStack } from "../lib/kubernetes";
import { Pipeline } from "../lib/pipeline";
import { ClientRegistry } from "../lib/registry";
import S3Stack from "../lib/s3";

const env = {
  region: "eu-west-1",
  account: "095812446517",
};
const app = new cdk.App();

if (!process.env.ENV) throw Error("No environment variable has been set");
//@ts-ignore
const prefix: "dev" | "prod" = process.env.ENV;

const authStack = new Pipeline(
  app,
  prefix + "-RoleloAuthPipeline",
  {
    bucketName: prefix + "-rolelo-auth",
    projectName: prefix + "-rolelo-auth",
    environmentVariables: {
      WORKSPACE: {
        value: "auth",
      },
      DEPLOY_BUCKET: {
        value: prefix + "-rolelo-auth",
      },
      DISTRIBUTION: {
        value: prefix === "dev" ? "E21KVTQ4LDWAGG" : "ESN4S2P31NZQV",
      },
      APP_ENVIRONMENT: {
        value: prefix === "dev" ? "development" : "production",
      },
    },
    repo: "mono-repo",
    branch: `${prefix}-auth`,
  },
  "buildspec-fe.yaml",
  prefix,
  { env }
);
const clientStack = new Pipeline(
  app,
  prefix + "-RoleloClientPipeline",
  {
    bucketName: prefix + "-rolelo-client",
    projectName: prefix + "-rolelo-client",
    environmentVariables: {
      WORKSPACE: {
        value: "client",
      },
      DEPLOY_BUCKET: {
        value: prefix + "-rolelo-client",
      },
      DISTRIBUTION: {
        value: prefix === "dev" ? "E2GSEZ55LCJHY3" : "E2Z5YTR4SV45RU",
      },
      APP_ENVIRONMENT: {
        value: prefix === "dev" ? "development" : "production",
      },
    },
    repo: "mono-repo",
    branch: `${prefix}-client`,
  },
  "buildspec-fe.yaml",
  prefix,
  { env }
);
const organisationStack = new Pipeline(
  app,
  prefix + "-RoleloOrganisationPipeline",
  {
    bucketName: prefix + "-rolelo-organisation",
    projectName: prefix + "-rolelo-organisation",
    environmentVariables: {
      WORKSPACE: {
        value: "organisation",
      },
      DEPLOY_BUCKET: {
        value: prefix + "-rolelo-organisation",
      },
      DISTRIBUTION: {
        value: prefix === "dev" ? "E1UB7M57FRGR8O" : "E3SPFIL7XSAMKN",
      },
      APP_ENVIRONMENT: {
        value: prefix === "dev" ? "development" : "production",
      },
    },
    repo: "mono-repo",
    branch: `${prefix}-organisation`,
  },
  "buildspec-fe.yaml",
  prefix,
  { env }
);
const backendPipeline = new Pipeline(
  app,
  prefix + "-RoleloBackendPipeline",
  {
    bucketName: prefix + "-rolelo-backend",
    projectName: prefix + "-rolelo-backend",
    environmentVariables: {
      DEPLOY_BUCKET: {
        value: prefix + "-rolelo-backend",
      },
    },
    repo: "mono-repo",
    branch: `${prefix}-backend`,
  },
  "buildspec-be.yaml",
  prefix,
  { env }
);
new Cloudfront(
  app,
  prefix + "-RoleloCloudfront-auth",
  authStack.s3Role!,
  [`${prefix === "dev" ? "dev-" : ""}auth.rolelo.com`],
  { env }
);
new Cloudfront(
  app,
  prefix + "-RoleloCloudfront-client",
  clientStack.s3Role!,
  [`${prefix === "dev" ? "dev-" : ""}client.rolelo.com`],
  { env }
);
new Cloudfront(
  app,
  prefix + "-RoleloCloudfront-organisation",
  organisationStack.s3Role!,
  [`${prefix === "dev" ? "dev-" : ""}organisation.rolelo.com`],
  { env }
);

const clientRegistry = new ClientRegistry(app, prefix + "-registry", { env });

new CognitoStack(app, "rolelo-cognito", {
  env,
});
new S3Stack(app, "rolelo-s3stack", {
  env,
});
new KubernetesStack(app, "rolelo-k8sstack", {
  env,
});
