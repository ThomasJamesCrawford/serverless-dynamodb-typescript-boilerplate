import type { APIGatewayProxyEvent } from 'aws-lambda';

const ERROR = 'Invalid parameters. name, url and schema must be supplied';

export const parseProposedFromEvent = (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    throw new Error(ERROR);
  }

  const {
    name,
    url,
    schema,
  }: { name?: string; url?: string; schema?: string } = JSON.parse(event.body);

  if (!name || !url || !schema) {
    throw new Error(ERROR);
  }

  return {
    name,
    url,
    schema,
  };
};
