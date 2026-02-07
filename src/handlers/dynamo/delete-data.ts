import { APIGatewayProxyHandler } from "aws-lambda";
import { lambdaResponse } from "../../utils/util";
import { deleteItem } from "../../utils/dynamoClient";

export const handler: APIGatewayProxyHandler = async (event): Promise<any> => {
  try {
    const pathParams = event.pathParameters;
    const resp = await deleteItem({ id: pathParams?.id || "default-id" });
    return lambdaResponse(200, { message: "Item deleted", data: resp });
  } catch (error) {
    console.error("Internal server error ", error);
    return lambdaResponse(500, { error: "Internal Server Error", data: {} });
  }
};
