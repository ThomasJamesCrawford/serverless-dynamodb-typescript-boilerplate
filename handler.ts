// eslint-disable-next-line import/no-unresolved
import type { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (_event) => {

  return {
    statusCode: 200,
    body: JSON.stringify({ hello: "world"}),
  };
};
