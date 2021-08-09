import { UpdateFunctionCodeCommand } from '@aws-sdk/client-lambda';

interface RunInput {
  zipFileLocation: string;
  lambdaName: string;
  publish: boolean;
}

class Action {
  constructor(
    private readonly readFile: (path: string) => Promise<Buffer>,
    private readonly updateFunctionCode: (
      args: UpdateFunctionCodeCommand
    ) => Promise<void>,
    private readonly log: (message: string) => void
  ) {}

  async run(input: RunInput): Promise<void> {
    this.log(`Updating ${input.lambdaName}`);

    const zipFile = await this.readFile(input.zipFileLocation);

    const cmd = new UpdateFunctionCodeCommand({
      FunctionName: input.lambdaName,
      Publish: input.publish,
      ZipFile: zipFile
    });

    await this.updateFunctionCode(cmd);

    this.log(`Updated ${input.lambdaName}`);
  }
}

export { RunInput, Action };
