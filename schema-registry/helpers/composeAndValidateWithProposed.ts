// eslint-disable-next-line import/no-unresolved
import { parse } from 'graphql';
import { composeAndValidate } from '@apollo/federation';
import { getServiceList, Service } from './getServiceList';

export const composeAndValidateWithProposed = async (
  proposedNewSchema: Service,
  federationName: string
) => {
  const existingServiceList = await getServiceList(federationName);

  const proposedNewServiceList = existingServiceList
    .filter(({ name }) => name !== proposedNewSchema.name)
    .concat(proposedNewSchema)
    .map(({ schema, ...rest }) => ({ ...rest, typeDefs: parse(schema) }));

  return composeAndValidate(proposedNewServiceList);
};
