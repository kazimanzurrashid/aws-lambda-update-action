import { UpdateFunctionCodeRequest } from '@aws-sdk/client-lambda/types/models';

interface RunInput {
  zipFileLocation: string;
  lambdaName: string;
  publish: boolean;
}

class Runner {
  constructor(
    private readonly readFile: (
      path: string,
      callback: (err: Error | null, data: Buffer) => void
    ) => void,
    private readonly lambda: {
      updateFunctionCode: (
        args: UpdateFunctionCodeRequest,
        cb: (err: Error) => void
      ) => void;
    },
    private readonly setFailed: (message: string | Error) => void
  ) {}

  run(input: RunInput): void {
    this.readFile(input.zipFileLocation, (readError, zipFile) => {
      if (readError) {
        return this.setFailed(readError.message);
      }

      const params = {
        FunctionName: input.lambdaName,
        ZipFile: zipFile,
        Publish: input.publish
      };

      this.lambda.updateFunctionCode(params, (updateError: Error) => {
        if (updateError) {
          this.setFailed(updateError.message);
        }
      });
    });
  }
}

export { RunInput, Runner };
