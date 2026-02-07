import { APIGatewayProxyHandler } from "aws-lambda";
import { lambdaResponse } from "../../utils/util";
import { sendToSQS } from "../../utils/messagingClients";

const QUEUE = process.env.QUEUE_URL as string;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const message = {
      date: new Date().toISOString(),
      data: `message from sqs publisher ${QUEUE}`,
    };
    const res = await sendToSQS(QUEUE, JSON.stringify(message));
    return lambdaResponse(200, { message: "Message sent to SQS", data: res });
  } catch (error) {
    console.error("Internal server error ", error);
    return lambdaResponse(500, { error: "Internal Server Error", data: {} });
  }
};
