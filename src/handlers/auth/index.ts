import { APIGatewayAuthorizerHandler, PolicyDocument } from "aws-lambda";

function generatePolicy(principalId: string, effect: string, resource: string) {
  const policy: any = {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
  return policy;
}

export const handler: APIGatewayAuthorizerHandler = async (event) => {
  try {
    // const token = event? || "";
    // simple logic: allow if token is 'allow' otherwise deny
    // if (token === "allow") {
    return generatePolicy("user", "Allow", event.methodArn);
    // }
    // return generatePolicy("user", "Deny", event.methodArn);
  } catch (err) {
    console.error("authorizer error", err);
    throw err;
  }
};
