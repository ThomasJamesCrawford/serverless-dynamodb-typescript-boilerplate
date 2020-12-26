import awsLambdaFastify from 'aws-lambda-fastify';
import mercurius from 'mercurius';
import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { getServiceList } from '../schema-registry/helpers/getServiceList';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  let app = null;
  if ((global as any).app) {
    app = (global as any).app;
  } else {
    app = Fastify();

    const services = await getServiceList(process.env.federationName || '');

    app.register(fastifyCors, {
      origin: '*',
      credentials: true,
    });

    app.register(mercurius, {
      routes: true,
      path: '/graphql',
      gateway: {
        services,
      },
    });
    (global as any).app = app;
  }

  return awsLambdaFastify(app)(event, context);
};
