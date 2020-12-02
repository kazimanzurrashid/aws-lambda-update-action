import { UpdateFunctionCodeRequest } from '@aws-sdk/client-lambda/types/models';

interface RunInput {
  zipFileLocation: string;
  lambdaName: string;
  publish: boolean;
}

class Action {
  constructor(
    private readonly readFile: (path: string) => Promise<Buffer>,
    private readonly updateFunctionCode: (
      args: UpdateFunctionCodeRequest
    ) => Promise<void>,
    private readonly log: (message: string) => void,
    private readonly setFailed: (message: Error) => void
  ) {}

  async run(input: RunInput): Promise<void> {
    this.log(`Updating ${input.lambdaName}`);

    try {
      const zipFile = await this.readFile(input.zipFileLocation);

      const params = {
        FunctionName: input.lambdaName,
        Publish: input.publish,
        ZipFile: zipFile
      };

      await this.updateFunctionCode(params);

      this.log(`Updated ${input.lambdaName}`);
    } catch (error) {
      this.setFailed(error);
    }
  }
}

export { RunInput, Action };
