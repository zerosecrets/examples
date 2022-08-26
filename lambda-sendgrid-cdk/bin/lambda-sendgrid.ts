#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaSendgridStack } from '../lib/lambda-sendgrid-stack';

const app = new cdk.App();
new LambdaSendgridStack(app, 'LambdaSendgridStack');
