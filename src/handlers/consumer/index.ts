import type { SQSEvent, SQSHandler } from "aws-lambda";
import { lambdaResponse } from "../../utils/util";

export const handler: SQSHandler = async (event: SQSEvent): Promise<any> => {
  try {
    console.log("Received message:", event.Records[0].body);

    return lambdaResponse(200, {
      message: "Message processed successfully",
      data: event.Records[0].body,
    });
  } catch (err) {
    console.error("consumer handler error", err);
    return lambdaResponse(500, { error: "Internal Server Error", data: {} });
  }
};
