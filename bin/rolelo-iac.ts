#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CognitoStack } from '../lib/cognito';

const app = new cdk.App();
new CognitoStack(app, "rolelo-cognito", {
  env: {
    region: "eu-west-1",
    account: "619680812856",
  },
});