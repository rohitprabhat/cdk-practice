import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction as LambdaFunctionTarget } from 'aws-cdk-lib/aws-events-targets';

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceApi');
  private spaceTable = new GenericTable('SpacesTable', 'SpaceId', this);
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // const helloLambda = new LambdaFunction(this, 'helloLambda', {
    //   runtime: Runtime.NODEJS_14_X,
    //   code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
    //   handler: 'hello.main',
    // });

    const fn = new LambdaFunction(this, 'MyFunc', {
      runtime: Runtime.NODEJS_14_X,
      handler: 'hello.main',
      code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
    });

    const helloLambdaNodejs = new NodejsFunction(this, 'helloLambdaNodejs', {
      entry: join(__dirname, '..', 'services', 'node-lambda', 'throttle.ts'),
      handler: 'handler',
    });

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');
    helloLambdaNodejs.addToRolePolicy(s3ListPolicy);

    //"Action": "events:PutRule"

    const eventPolicy = new PolicyStatement();
    eventPolicy.addActions('events:PutEvents');
    eventPolicy.addResources('*');
    helloLambdaNodejs.addToRolePolicy(eventPolicy);

    const bus = new EventBus(this, 'testscorebus', {
      eventBusName: 'mytestscorebus',
    });

    const testEventRule = new Rule(this, 'test-score-event-rule', {
      eventBus: bus,
      eventPattern: { source: ['careers.data'], detailType: ['INSERT'] },
    });

    testEventRule.addTarget(new LambdaFunctionTarget(fn));

    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodejs);
    const helloLambdaResource = this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration);
  }
}
