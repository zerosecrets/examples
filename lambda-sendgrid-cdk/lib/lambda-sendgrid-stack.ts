import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SendEmail } from './send-email';

export class LambdaSendgridStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new SendEmail(this, 'send-email');
  }
}
