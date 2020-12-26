import type { APIGatewayProxyEvent } from 'aws-lambda';

export const parseFederationNameFromEvent = (event: APIGatewayProxyEvent) => {
  const federationName = event.pathParameters?.id;

  if (!federationName) {
    throw new Error('Federation name not supplied in URL');
  }

  return federationName;
};
