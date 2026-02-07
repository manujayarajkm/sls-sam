import { APIGatewayProxyHandler } from "aws-lambda";
import { lambdaResponse } from "../../utils/util";
import { getItem } from "../../utils/dynamoClient";

export const handler: APIGatewayProxyHandler = async (event): Promise<any> => {
  try {
    const pathParams = event.pathParameters;
    const resp = await getItem({ pk: pathParams?.id || "default-id" });
    return lambdaResponse(200, { message: "Item retrieved", data: resp });
  } catch (error) {
    console.error("Internal server error ", error);
    return lambdaResponse(500, { error: "Internal Server Error", data: {} });
  }
};
