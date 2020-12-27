import createEvent from 'mock-aws-events';
import Fastify from 'fastify';
import mercurius from 'mercurius';
import { mapper } from '../../schema-registry/dynamodb/mapper';
import { handler } from '../../graphql-gateway/gateway';
import { newSchema } from '../../schema-registry/models/Schema';

const topPosts = [
  {
    id: 1,
    title: 'test',
    content: 'test',
    authorIds: [1, 2],
  },
  {
    id: 2,
    title: 'test2',
    content: 'test2',
    authorIds: [3],
  },
];

const users = [
  {
    id: 1,
    name: 'toto',
  },
  {
    id: 2,
    name: 'titi',
  },
  {
    id: 3,
    name: 'tata',
  },
];

const createService = async (name: string, schema: string, resolvers = {}) => {
  const service = Fastify();

  service.register(mercurius, {
    schema,
    resolvers,
    federationMetadata: true,
  });

  await service.listen(0);

  const address: any = service.server.address();

  const model = await newSchema(
    'test',
    schema,
    `http://localhost:${address.port}/graphql`,
    name
  );

  await mapper.put(model);

  return () => service.close();
};

const createUserService = async () => {
  const schema = `
    type User @key(fields: "id") {
      id: ID!
      name: String!
    }
  `;

  const resolvers = {
    User: {
      __resolveReference: async ({ id }: { id: string | number }) =>
        users.find((u) => u.id === +id),
    },
  };

  return createService('user', schema, resolvers);
};

const createPostsService = async () => {
  const schema = `
    extend type Query {
      topPosts: [Post!]!
    }
    type Post @key(fields: "id") {
      id: ID!
      title: String!
      content: String!
      authors: [User!]!
    }
    extend type User @key(fields: "id") {
      id: ID! @external
    }
  `;

  const resolvers = {
    Post: {
      authors: async (root: typeof topPosts[0]) =>
        root.authorIds.map((id) => ({ id })),
    },
    Query: {
      topPosts: async () => topPosts,
    },
  };

  return createService('posts', schema, resolvers);
};

const queryEvent = (query: string, variables = {}) =>
  createEvent('aws:apiGateway', {
    body: JSON.stringify({
      query,
      variables,
    }),
    path: '/graphql',
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

test('basic', async () => {
  const close = await createUserService();
  const close2 = await createPostsService();

  const query = `
    query TopPosts {
      topPosts {
        id
        title
        content
        authors {
          id
          name
        }
      }
    }`;

  const ctx: any = {};

  const res: any = await handler(queryEvent(query), ctx, () => null);

  await close();
  await close2();

  return expect(JSON.parse(res.body)).toMatchObject({
    data: {
      topPosts: [
        {
          id: '1',
          title: 'test',
          content: 'test',
          authors: [
            {
              id: '1',
              name: 'toto',
            },
            {
              id: '2',
              name: 'titi',
            },
          ],
        },
        {
          id: '2',
          title: 'test2',
          content: 'test2',
          authors: [
            {
              id: '3',
              name: 'tata',
            },
          ],
        },
      ],
    },
  });
}, 60000);
