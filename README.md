# Lambda update action

This action updates a given lambda. It is very lightweight comparing to others, it uses the upcoming AWS Node SDK 3 which only pulls lambda client to update the lambda code.
 
## Inputs

### `zip-file`

**Required** The zip location, this is the only required argument of this action. It reads the AWS configuration from parameters,
if not specified then it fallbacks to `env` section.

### `lambda-name`

**Optional** if not specified. it takes the zip file base name as lambda name. (e.g. if the zip file is `my_lambda.zip` it would update `my_lambda`)

### `publish`

_Optional_ The default is `false`
.

### `AWS_REGION`

_Optional_ if not specified fallbacks to environment variable.

### `AWS_ACCESS_KEY_ID`

_Optional_ if not specified fallbacks to environment variable.

### `AWS_SECRET_ACCESS_KEY`

_Optional_ if not specified fallbacks to environment variable.

## Outputs

N/A

## Example usage

### minimum

```yaml
uses: kazimanzurrashid/lambda-update-action
with:
  zip-file: './dist/my_lambda.zip'
```

### all

```yaml
uses: kazimanzurrashid/lambda-update-action
with:
  zip-file: './dist/my_lambda.zip'
  lambda-name: 'your_lambda'
  publish: true
  AWS_REGION: ${{ secrets.AWS_REGION }}
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### complete

```yaml
name: API
on:
  push:
    branches:
      - main
env:
  AWS_REGION: ${{ secrets.AWS_REGION }}
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: .NET setup
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: 3.1.x

      - name: Lambda.Tools install
        run: dotnet tool install -g Amazon.Lambda.Tools

      - name: Build
        run: |
          cd src/Api
          dotnet lambda package -o api.zip

      - name: Update
        uses: kazimanzurrashid/lambda-update-action@main
        with:
          zip-file: src/Api/api.zip
```
