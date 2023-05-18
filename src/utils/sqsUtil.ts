import AWS from 'aws-sdk';
// include aws secret key and access key
AWS.config.update({
    region: 'us-east-1',
});
const config={
    region: 'us-east-1',
    endpoint: new AWS.Endpoint('http://localhost:4566'),
    accessKeyId: 'na',
    secretAccessKey: 'na',
}
const sqs = new AWS.SQS(config);

export const sendSQSMessage = async (message: string): Promise<void> => {
  const params = {
    QueueUrl: 'http://localhost:4566/000000000000/my-queue',
    MessageBody: message,
  };

  const resp=await sqs.sendMessage(params).promise();
  console.log(resp,"Message added to queue");
  // get entries from queue
};
