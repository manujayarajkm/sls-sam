import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  console.log("Scheduled function invoked", new Date().toISOString());
  return { status: "ok" };
};
