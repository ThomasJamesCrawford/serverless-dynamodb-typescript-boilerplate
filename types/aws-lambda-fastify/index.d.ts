/* eslint-disable no-unused-vars */
declare module 'aws-lambda-fastify' {
  import type { FastifyInstance } from 'fastify';
  import type {
    APIGatewayEvent,
    APIGatewayProxyResult,
    Context,
  } from 'aws-lambda';

  const awsLambdaFastify: (
    app: FastifyInstance
  ) => (
    event: APIGatewayEvent,
    context: Context
  ) => Promise<APIGatewayProxyResult>;
  // eslint-disable-next-line import/no-default-export
  export default awsLambdaFastify;
}
