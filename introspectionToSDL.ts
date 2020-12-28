// eslint-disable-next-line import/no-unresolved
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';
import fetch from 'node-fetch';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { url } = JSON.parse(event.body!);

  const schema = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ query: getIntrospectionQuery() }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then(({ data }) => {
      return buildClientSchema(data);
    });

  const sdl = printSchema(schema);

  return {
    statusCode: 200,
    body: JSON.stringify({ sdl }),
  };
};
