/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable-next-line import/no-unresolved */
module.exports = async () => {
  const serverless = new (require('serverless'))();

  await serverless.init();

  const service = await serverless.variables.populateService();

  const { environment } = service.provider;

  Object.keys(environment).forEach((key) => {
    process.env[key] = environment[key];
  });

  const resources = service.resources.Resources;

  const tables = Object.keys(resources)
    .map((name) => resources[name])
    .filter((r) => r.Type === 'AWS::DynamoDB::Table')
    .map(({ Properties: { TimeToLiveSpecification, ...rest } }) => ({
      ...rest,
    }));

  return {
    tables,
    port: 8000,
  };
};
