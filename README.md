# cross-account SAM TypeScript app

This workspace contains an AWS SAM project scaffold with 4 Node.js (v24) Lambdas written in TypeScript:

- `upload-s3-fn` — uploads/downloads objects and creates presigned URLs for S3
- `dynamo-fn` — PutItem / GetItem / Query on DynamoDB
- `publisher-fn` — publishes messages to SNS and sends to SQS
- `consumer-fn` — triggered by SQS to consume messages
- `scheduled-fn` — runs every 5 minutes via EventBridge Schedule

Quick steps:

1. Install deps: `npm install`
2. Build TypeScript: `npm run build`
3. Deploy with SAM: `sam deploy --guided` (SAM CLI required)

Notes:

- The SAM template is `template.yaml`.
- Handlers are in `src/handlers/*`. After build JS will be in `dist/handlers/*`.
