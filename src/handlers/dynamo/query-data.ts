import { APIGatewayProxyHandler } from "aws-lambda";
import { lambdaResponse } from "../../utils/util";
import { queryItems } from "../../utils/dynamoClient";

export const handler: APIGatewayProxyHandler = async (event): Promise<any> => {
  try {
    const pathParams = event.pathParameters;
    const resp = await queryItems(
      { "#name": "name" },
      { ":name": pathParams?.name ?? "default" },
    );
    return lambdaResponse(200, { message: "Item retrieved", data: resp });
  } catch (error) {
    console.error("Internal server error ", error);
    return lambdaResponse(500, { error: "Internal Server Error", data: {} });
  }
};
