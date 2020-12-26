import { beginsWith } from '@aws/dynamodb-expressions';
import { parse } from 'graphql';
import { ungzip } from 'node-gzip';
import { mapper } from '../dynamodb/mapper';
import { Schema, makePK } from '../models/Schema';

export interface Service {
  name: string;
  url: string;
  schema: string;
}

export const getServiceList = async (federationName: string) => {
  const schemasPromise = mapper.query(Schema, {
    PK: makePK(federationName),
    SK: beginsWith('schema'),
  });

  const serviceList: Service[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const { schema: schemaCompressed, url, name } of schemasPromise) {
    const schema = (await ungzip(schemaCompressed)).toString();

    serviceList.push({
      schema,
      url,
      name,
    });
  }

  return serviceList;
};

export const getServiceListParsed = async (federationName: string) =>
  (await getServiceList(federationName)).map(({ schema, ...rest }) => ({
    ...rest,
    typeDefs: parse(schema),
  }));
