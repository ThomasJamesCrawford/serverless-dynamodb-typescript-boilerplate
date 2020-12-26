import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import { gzip } from 'node-gzip';

@table(process.env.schemaRegistryTable || '')
export class Schema {
  @hashKey()
  PK!: string;

  @rangeKey()
  SK!: string;

  @attribute()
  schema!: Uint8Array;

  @attribute()
  url!: string;

  @attribute()
  name!: string;

  federationName() {
    return this.PK.split('_')[1];
  }
}

export const newSchema = async (
  federationName: string,
  schema: string,
  url: string,
  name: string
) =>
  Object.assign(new Schema(), {
    PK: makePK(federationName),
    SK: makeSK(name),
    schema: await gzip(schema),
    name,
    url,
  });

export const makePK = (federationName: string) =>
  `federation_${federationName}`;

export const makeSK = (schemaName: string) => `schema_${schemaName}`;
