import { basename } from 'path';
import { readFile } from 'fs';

import { Lambda } from '@aws-sdk/client-lambda';
import { getInput, setFailed } from '@actions/core';

import { Runner } from './runner';

const getValue = (key: string): string =>
  (getInput(key) || process.env[key]) as string;

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

new Runner(readFile, lambda, setFailed).run({
  zipFileLocation,
  lambdaName,
  publish
});
