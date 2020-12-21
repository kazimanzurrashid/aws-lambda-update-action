import { basename } from 'path';
import { readFile } from 'fs';
import { promisify } from 'util';

import { Lambda } from '@aws-sdk/client-lambda';
import { getInput, info, setFailed } from '@actions/core';

import { Action } from './action';

const getValue = (key: string): string => getInput(key) || process.env[key];

const zipFileLocation = getInput('zip-file', { required: true });
const lambdaName = getInput('lambda-name') || basename(zipFileLocation, '.zip');
const publish = (getInput('publish') || '').toLowerCase() === 'true';

const awsRegion = getValue('AWS_REGION');
const awsAccessKeyId = getValue('AWS_ACCESS_KEY_ID');
const awsSecretAccessKey = getValue('AWS_SECRET_ACCESS_KEY');

const lambda = new Lambda({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey
  }
});

(async () => {
  try {
    await new Action(
      promisify(readFile),
      async (args) => {
        await lambda.updateFunctionCode(args);
      },
      info
    ).run({
      zipFileLocation,
      lambdaName,
      publish
    });
  } catch (error) {
    setFailed(error);
  }
})();
