import { SNS } from 'aws-sdk';
import AWS from 'aws-sdk';

const config={
    region: 'us-east-1',
    endpoint: new AWS.Endpoint('http://localhost:4566'),
    accessKeyId: 'test',
    secretAccessKey: 'test',
}
const sns = new SNS(config);

export const publishMessageToTopic = async (topicArn: string, message: string): Promise<void> => {
  const params = {
    TopicArn: topicArn,
    Message: message,
  };

  const resp=await sns.publish(params).promise();
  console.log(resp,"Message published to topic");
};
