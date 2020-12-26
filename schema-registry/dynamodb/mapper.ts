// eslint-disable-next-line import/no-extraneous-dependencies
import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';

const isTest = process.env.JEST_WORKER_ID;

const config = {
  convertEmptyValues: true,
  region: process.env.region,
  ...(isTest && {
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env',
  }),
};

const client = new DynamoDB(config);

export const mapper = new DataMapper({
  client,
});
