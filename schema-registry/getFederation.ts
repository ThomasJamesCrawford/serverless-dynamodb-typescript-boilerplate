import type { APIGatewayProxyEvent } from 'aws-lambda';
import { getServiceList } from './helpers/getServiceList';

export const handler = async (event: APIGatewayProxyEvent) => {
  const federationName = event.pathParameters!.id!;

  const serviceList = await getServiceList(federationName);

  return {
    statusCode: 200,
    body: JSON.stringify({ data: serviceList }),
  };
};
