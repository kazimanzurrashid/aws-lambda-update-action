import { basename } from 'path';
import { readFile } from 'fs/promises';

import { LambdaClient } from '@aws-sdk/client-lambda';
import { getInput, info, setFailed } from '@actions/core';

import { Action } from './action';

const getValue = (key: string): string =>
  (getInput(key) || (process.env[key] as unknown)) as string;

const zipFileLocation = getInput('zip-file', { required: true });
const lambdaName = getInput('lambda-name') || basename(zipFileLocation, '.zip');

const awsRegion = getValue('AWS_REGION');
const awsAccessKeyId = getValue('AWS_ACCESS_KEY_ID');
const awsSecretAccessKey = getValue('AWS_SECRET_ACCESS_KEY');
const awsSessionToken = getValue('AWS_SESSION_TOKEN');

const lambda = new LambdaClient({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
    sessionToken: awsSessionToken,
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
      lambdaName
    });
  } catch (error) {
    setFailed(error as Error);
  }
})();
