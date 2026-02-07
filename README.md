# cross-account SAM TypeScript project

Concise developer guide for the AWS SAM + TypeScript scaffold in this workspace. The project provides a small serverless example with S3, DynamoDB, SNS/SQS messaging, and an EventBridge scheduled Lambda.

Key components

- `upload-s3-fn` — Lambda that uploads/downloads S3 objects and returns presigned URLs.
- `dynamo-*` — split DynamoDB Lambdas (insert/get/query/delete) using a shared Dynamo helper.
- `publisher-fn` — publishes events to SNS and optionally sends messages to SQS.
- `consumer-fn` — SQS-triggered Lambda that consumes messages.
- `scheduled-fn` — EventBridge scheduled Lambda (every 5 minutes).

Quick start (local / CI)

1. Install dependencies

```bash
npm ci
```

2. Build TypeScript (produces `dist/`)

```bash
npm run build
```

3. Build & deploy with SAM (one of):

- Interactive (recommended for first deploy)

```bash
sam build --use-container
sam deploy --guided
```

- Non-interactive (CI)

Set `ARTIFACT_BUCKET`, `STACK_NAME`, and region in the environment and run the pipeline or use the provided `buildspec.yml` for AWS CodeBuild.

Project layout

- `template.yaml` — SAM template describing resources (S3, DynamoDB, SNS, SQS, Lambdas, Layer, API).
- `api-spec.yaml` — OpenAPI spec used by the `AWS::Serverless::Api` resource.
- `src/` — TypeScript sources
  - `src/handlers/*` — Lambda handlers
  - `src/utils/*` — shared AWS SDK helpers (S3, DynamoDB, SNS/SQS)
  - `src/layers/*` — code packaged as a Lambda Layer
- `tsconfig.json`, `package.json` — build and dependency configuration
- `buildspec.yml` — optional CodeBuild pipeline spec for CI cross-account deploys

Important notes and gotchas

- Ensure `ARTIFACT_BUCKET` (S3) is set and globally unique before packaging/deploying in CI. Missing this env causes `sam package` to fail with "Missing option '--s3-bucket'".
- The SAM template currently expects compiled JavaScript in `dist/` (so run the TypeScript build before `sam build`), and many resource names (bucket, ARNs in `api-spec.yaml`) may be account/region-specific — adjust them for your target account.
- SQS event source mappings require the queue ARN (not URL); the template uses `GetAtt` to provide the ARN.
- API Gateway authorizer is wired via the SAM `Auth` block (see `template.yaml`) to avoid OpenAPI import issues.

Suggested next steps

- Run the build locally and perform an initial `sam deploy --guided` to create resources in your account.
- Update `template.yaml` to choose a unique S3 bucket name or remove the hardcoded `BucketName` so SAM/CFN can create one.
- If you plan cross-account deploys, set `TARGET_ROLE_ARN` and `EXTERNAL_ID` in your pipeline and use the `buildspec.yml`.

Contact / development

If you want, I can:

- run a local build here to generate `dist/` and run `sam build` (requires Docker),
- or update the `buildspec.yml` to fail early with clearer error messaging for missing env variables.

---

Minimal quick reference

```bash
npm ci
npm run build
sam build --use-container
ARTIFACT_BUCKET=my-bucket sam package --s3-bucket "$ARTIFACT_BUCKET" --output-template-file packaged.yaml --s3-prefix "sam-artifacts/LOCAL/"
sam deploy --template-file packaged.yaml --stack-name my-stack --capabilities CAPABILITY_IAM --region ap-south-1
```

For detailed info see `template.yaml` and handlers under `src/handlers`.

Sample cross account role trust relationship

```bash
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<account-id>:root"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringEquals": {
                    "sts:ExternalId": "<external-id>"
                }
            }
        }
    ]
}
```

Sample codebuild/code pipeline environment variables

```bash
    ARTIFACT_BUCKET: "sls-sam-deployment-bucket"
    STACK_NAME: "your-sam-stack"
    TARGET_ROLE_ARN: "arn:aws:iam::TARGET_ACCOUNT_ID:role/CrossAccountPipelineRole"
    EXTERNAL_ID: "my-pipeline-external-id-abc123def"
    AWS_REGION: "ap-south-1"
```
