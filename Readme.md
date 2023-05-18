## Deployment

To run thi sproject on your local run these commands. Make sure node,docker, postgres, aws-cli is installed in your local. 
Use .env.example file to make.env file and provide values to it.

```bash
  npm install
  prisma migrate dev
  npm run dev
```
Run localstack using the docker compose file mentioned

```bash
docker compose up
```
Now use these command to setup SQS and SNS service on localstack

```bash
aws  --endpoint-url=http://localhost:4566 sqs create-queue --queue-name my-queue

aws  --endpoint-url=http://localhost:4566 sns create-topic --name test-topic

aws  --endpoint-url=http://localhost:4566 lambda create-function --function-name sqsListener --runtime nodejs14.x --handler sqsListener.sqsListener --zip-file fileb://./sqsListener.zip --role arn:aws:iam::000000000000:role/lambda-role

 aws  --endpoint-url=http://localhost:4566 lambda create-event-source-mapping --function-name sqsListener --batch-size 1 --event-source-arn arn:aws:sqs:us-east-1:000000000000:my-queue
```
Use this endpoint to create products and get products
```bash
http://localhost:3000/products/
```