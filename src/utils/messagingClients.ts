import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

const REGION = process.env.AWS_REGION || "us-east-1";

export const snsClient = new SNSClient({ region: REGION });
export const sqsClient = new SQSClient({ region: REGION });

export async function publishToSNS(topicArn: string, message: string) {
  try {
    await snsClient.send(
      new PublishCommand({ TopicArn: topicArn, Message: message }),
    );
    return true;
  } catch (err) {
    console.error("publishToSNS error", err);
    throw err;
  }
}

export async function sendToSQS(queueUrl: string, message: string) {
  try {
    await sqsClient.send(
      new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: message }),
    );
    return true;
  } catch (err) {
    console.error("sendToSQS error", err);
    throw err;
  }
}

export function parseSNSMessage(event: any): string[] {
  try {
    if (!event?.Records) return [];
    return event.Records.map((r: any) => r.Sns?.Message).filter(Boolean);
  } catch (err) {
    console.error("parseSNSMessage error", err);
    throw err;
  }
}

export async function receiveFromSQS(
  queueUrl: string,
  maxMessages = 1,
): Promise<{ body: string; receiptHandle: string }[]> {
  try {
    const resp = await sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxMessages,
      }),
    );
    if (!resp.Messages) return [];
    return resp.Messages.map((m) => ({
      body: m.Body || "",
      receiptHandle: m.ReceiptHandle || "",
    }));
  } catch (err) {
    console.error("receiveFromSQS error", err);
    throw err;
  }
}

export async function deleteFromSQS(
  queueUrl: string,
  receiptHandle: string,
): Promise<void> {
  try {
    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      }),
    );
  } catch (err) {
    console.error("deleteFromSQS error", err);
    throw err;
  }
}
