# Lambda update action

This action updates a given lambda. It 

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

### complete

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
