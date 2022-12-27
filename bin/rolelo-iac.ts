#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CognitoStack } from '../lib/cognito';
import S3Stack from '../lib/s3';
import { KubernetesStack } from '../lib/kubernetes';
import { Pipeline } from '../lib/pipeline';
import { Cloudfront } from '../lib/cloudfront';

const env = {
  region: "eu-west-1",
  account: "619680812856",
};
const app = new cdk.App();

if (!process.env.ENV) throw Error("No environment variable has been set");
//@ts-ignore
const prefix: 'dev' | 'prod' = process.env.ENV;

const authStack = new Pipeline(
  app,
  prefix + "-RoleloAuthPipeline",
  {
    bucketName: prefix + "-rolelo-auth",
    projectName: prefix + "-rolelo-auth",
    environmentVariables: {
      DEPLOY_BUCKET: {
        value: prefix + "-rolelo-auth",
      },
      DISTRIBUTION: {
        value: prefix === "dev" ? "E943HERUWBJ2A" : "EE9K6I5X9TIPH",
      },
      APP_ENVIRONMENT: {
        value: prefix,
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
      DEPLOY_BUCKET: {
        value: prefix + "-rolelo-client",
      },
      DISTRIBUTION: {
        value: prefix === "dev" ? "E943HERUWBJ2A" : "EE9K6I5X9TIPH",
      },
      APP_ENVIRONMENT: {
        value: prefix,
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
      DEPLOY_BUCKET: {
        value: prefix + "-rolelo-organisation",
      },
      DISTRIBUTION: {
        value: prefix === "dev" ? "E39VMIS93QYS8D" : "EE9K6I5X9TIPH",
      },
      APP_ENVIRONMENT: {
        value: prefix,
      },
    },
    repo: "mono-repo",
    branch: `${prefix}-organisation`,
  },
  "buildspec-fe.yaml",
  prefix,
  { env }
);
new Cloudfront(
  app,
  prefix + "-RoleloCloudfront-client",
  authStack.s3Role!,
  clientStack.s3Role!,
  organisationStack.s3Role!,
  [`${prefix === "dev" ? "dev-" : ""}app.rolelo.com`],
  { env }
);

new CognitoStack(app, "rolelo-cognito", {
  env
});
new S3Stack(app, 'rolelo-s3stack', {
  env
});
new KubernetesStack(app, 'rolelo-k8sstack', {
  env
})