import { v4 } from 'uuid';
import { S3 } from 'aws-sdk';

const s3Client = new S3();

async function handler(event: any, context: any) {
  const buckets = await s3Client.listBuckets().promise();
  console.log(JSON.stringify(buckets));
  return {
    statusCode: 200,
    body: 'Hello from Lambda ' + v4(),
    bucket: buckets,
  };
}

export { handler };
