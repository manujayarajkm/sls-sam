import { APIGatewayProxyHandler } from "aws-lambda";
import { lambdaResponse } from "../../utils/util";
import { putItem } from "../../utils/dynamoClient";
import { publishToSNS } from "../../utils/messagingClients";

export const handler: APIGatewayProxyHandler = async (event): Promise<any> => {
  try {
    const body = event.body ? JSON.parse(event.body) : null;
    const resp = await putItem({
      id: body?.id || `id-${Date.now()}`,
      name: body?.name || "default name",
    });

    const message = {
      date: new Date().toISOString(),
      data: `item inserted with id ${body?.id || `id-${Date.now()}`}`,
    };
    await publishToSNS(
      process.env.TOPIC_ARN as string,
      JSON.stringify(message),
    );
    return lambdaResponse(200, { message: "Item inserted", data: resp });
  } catch (error) {
    console.error("Internal server error ", error);
    return lambdaResponse(500, { error: "Internal Server Error", data: {} });
  }
};
