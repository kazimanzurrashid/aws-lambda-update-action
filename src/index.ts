import { basename } from 'path';
import { readFile } from 'fs/promises';

import { LambdaClient } from '@aws-sdk/client-lambda';
import { getInput, info, setFailed } from '@actions/core';

import { Action } from './action';

const getValue = (key: string): string =>
  (getInput(key) || (process.env[key] as unknown)) as string;

const zipFileLocation = getInput('zip-file', { required: true });
const lambdaName = getInput('lambda-name') || basename(zipFileLocation, '.zip');
const publish = (getInput('publish') || '').toLowerCase() === 'true';

const awsRegion = getValue('AWS_REGION');
const awsAccessKeyId = getValue('AWS_ACCESS_KEY_ID');
const awsSecretAccessKey = getValue('AWS_SECRET_ACCESS_KEY');

const lambda = new LambdaClient({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey
  }
});

(async () => {
  try {
    await new Action(
      readFile,
      async (args) => {
        await lambda.send(args);
      },
      info
    ).run({
      zipFileLocation,
      lambdaName,
      publish
    });
  } catch (error) {
    setFailed(error as Error);
  }
})();
