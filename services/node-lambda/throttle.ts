import { S3 } from 'aws-sdk';
import { EventBridge } from 'aws-sdk';

const s3Client = new S3();
const eventBridgeClient = new EventBridge();

async function handler(event: any, context: any) {
  let resp = await eventBridgeClient
    .putEvents({
      Entries: [
        {
          DetailType: 'INSERT',
          EventBusName: 'mytestscorebus',
          Source: 'careers.data',
          Resources: ['testagain'],
          Time: new Date(),
        },
      ],
    })
    .promise();
  console.log('ROHIT Res: ', resp);
  return {
    statusCode: 200,
    body: 'Hello from Lambda ',
  };
}

export { handler };
