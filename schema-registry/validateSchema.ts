// eslint-disable-next-line import/no-unresolved
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { composeAndValidateWithProposed } from './helpers/composeAndValidateWithProposed';
import { parseFederationNameFromEvent } from './helpers/parseFederationNameFromEvent';
import { parseProposedFromEvent } from './helpers/parseProposedFromEvent';

export const handler: APIGatewayProxyHandler = async (event) => {
  const federationName = parseFederationNameFromEvent(event);
  const proposedNewServiceSchema = parseProposedFromEvent(event);

  const { errors, composedSdl } = await composeAndValidateWithProposed(
    proposedNewServiceSchema,
    federationName
  );

  if (errors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ composedSdl }),
  };
};
