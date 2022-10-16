#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CognitoStack } from '../lib/cognito';
import S3Stack from '../lib/s3';

const env = {
  region: "eu-west-1",
  account: "619680812856",
};
const app = new cdk.App();
new CognitoStack(app, "rolelo-cognito", {
  env
});
new S3Stack(app, 'rolelo-s3stack', {
  env
});