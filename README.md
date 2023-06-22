# AWS Lambda update action

[![GitHub](https://img.shields.io/github/license/kazimanzurrashid/aws-lambda-update-action)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/kazimanzurrashid/aws-lambda-update-action)](https://github.com/kazimanzurrashid/aws-lambda-update-action/releases)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/kazimanzurrashid/aws-lambda-update-action/ci.yml)](https://github.com/kazimanzurrashid/aws-lambda-update-action/actions)

This action updates a given lambda. It is very lightweight comparing to others, it uses the latest [AWS Node SDK 3](https://github.com/aws/aws-sdk-js-v3) which
only pulls lambda client to update the lambda code.

## Usage

### minimum

```yaml
uses: kazimanzurrashid/aws-lambda-update-action@v2.0.2
with:
  zip-file: './dist/my_lambda.zip'
```

### complete

```yaml
uses: kazimanzurrashid/aws-lambda-update-action@v2.0.2
with:
  zip-file: './dist/my_lambda.zip'
  lambda-name: 'your_lambda'
  AWS_REGION: ${{ secrets.AWS_REGION }}
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  AWS_SESSION_TOKEN: ${{ secrets.AWS_SESSION_TOKEN }} 
```

## AWS Permission

The AWS Account needs to have the `"lambda:UpdateFunctionCode"` permission.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["lambda:UpdateFunctionCode"],
      "Resource": "*" // Don't use for production, change it to only your lambda name
    }
  ]
}
```

## Inputs

### `zip-file`

**Required**. The zip location, this is the only required argument of this action.

### `lambda-name`

_Optional_. If not specified. it takes the zip file base name as lambda name. (e.g. if the zip file is `my_lambda.zip` it would update `my_lambda` lambda)

### `AWS_REGION`

_Optional_, if not specified fallbacks to environment variable.

### `AWS_ACCESS_KEY_ID`

_Optional_, if not specified fallbacks to environment variable.

### `AWS_SECRET_ACCESS_KEY`

_Optional_, if not specified fallbacks to environment variable.

### `AWS_SESSION_TOKEN`

_Optional_, if not specified fallbacks to environment variable.

## Outputs

N/A

## Examples

### Node.js Lambda

```yaml
name: API
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Node.js setup
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Build
        run: |
          npm ci
          npm run pack
          cd dist && zip -r -9 api.zip *

      - name: Update
        uses: kazimanzurrashid/aws-lambda-update-action@v2.0.2
        with:
          zip-file: dist/api.zip
        env:
          AWS_REGION: ${{ secrets.AWS_REGION }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Go Lambda

```yaml
name: API
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Go setup
        uses: actions/setup-go@v3
        with:
          go-version: 1.19

      - name: Build
        run: |
          go get -v -t -d ./...
          mkdir dist
          CGO_ENABLED=0 go build -o dist/main
          cd dist && zip -r -9 api.zip *

      - name: Update
        uses: kazimanzurrashid/aws-lambda-update-action@v2.0.2
        with:
          zip-file: dist/api.zip
        env:
          AWS_REGION: ${{ secrets.AWS_REGION }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### .NET Lambda

```yaml
name: API
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: .NET setup
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 6

      - name: Lambda.Tools install
        run: dotnet tool install -g Amazon.Lambda.Tools

      - name: Build
        run: |
          cd src/Api
          dotnet lambda package -o api.zip

      - name: Update
        uses: kazimanzurrashid/aws-lambda-update-action@v2.0.2
        with:
          zip-file: src/Api/api.zip
        env:
          AWS_REGION: ${{ secrets.AWS_REGION }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## License

This project is distributed under the [MIT license](LICENSE).
