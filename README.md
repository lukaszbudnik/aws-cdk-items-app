#  aws-cdk-items-app

This is a sample TypeScript CDK app to show how to set up AWS API Gateway JWT Authorizers using Keycloak as an OIDC provider.

The sample app comprises of the following components:

* DynamoDB table `items`
* Lambda function `create-item` - creates an item in DynamoDB table, parses JWT token from the request and uses email claim as a PK attribute (SK attribute is uuid)
* Lambda function `get-items` - gets items from DynamoDB table, performs scan operation on the table
* API Gateway v2 HTTP service with JWT authorizer
  * `GET /items` - invokes `get-items` lambda, publically available
  * `POST /items` - invokes `create-items` lambda, available to authorized users only

# Setup

Make sure you have cdk installed and cdk has access to typescript and all nodejs packages are available:

```bash
# global setup
npm install -g cdk
npm install -g typescript
# project-specific setup
git clone git@github.com:lukaszbudnik/aws-cdk-items-app.git
cd aws-cdk-items-app
npm link typescript
npm install
# check if cdk can synthesize the stacks
cdk synth
# build create-item lambda - nothing special, but uses uuid to generate unique SK in DynamoDB
cd lib/lambda/create-item
npm install
```

# Deploy

The cdk will deploy two stacks in your AWS account: `Database` and `Service`. cdk will take care of provisioning everything, including IAM policies.

In order to deploy JWT Authorizer the following two parameters are required and have to be valid: `Service:jwtIssuer` and `Service:jwtAudience`. 

The JWT Authorizer is validated during the deploy and the deployment will fail if any of the parameters is missing or is invalid. If you don't have OIDC provider at hand, don't worry, I got you covered. See my video which shows how super easy it is to deploy Keycloak cluster to AWS EKS: https://youtu.be/BuNZ7bjbzOQ.

Once you have Keycloak (or any other OIDC provider), pass the issuer URL and audience parameters to the cdk deploy command:

```bash
cdk bootstrap
cdk deploy --all \
  --parameters Service:jwtIssuer=https://example.com/auth/realms/customer123 \
  --parameters Service:jwtAudience=account
```

## Useful commands

The `cdk.json` file tells the CDK Toolkit how to execute your app.

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk destroy`     destroys this stack from your default AWS account/region
