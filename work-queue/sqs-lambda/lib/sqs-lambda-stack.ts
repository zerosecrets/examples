import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class SqsLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'OrderQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    const handleOrderFunction = new NodejsFunction(
      this,
      'HandleOrderFunction',
      {
        entry: 'lambda-functions/handle-order.ts',
        runtime: lambda.Runtime.NODEJS_18_X,
      }
    );

    queue.grantConsumeMessages(handleOrderFunction);
    handleOrderFunction.addEventSource(new SqsEventSource(queue, {}));
  }
}
