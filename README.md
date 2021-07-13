#  aws-cdk-items-app

This is a sample project for CDK TypeScript that sets up the following deployment:

* DynamoDB table `items`
* Lambda function for creating items `create-item`
* Lambda function for getting items `get-items`
* API Gateway v2 service with JWT authorizer

This project is used to show how to set up JWT Authorizers using Keycloak as the OIDC server.

# Setup

Make sure you have cdk installed (or use Amazon Linux 2 that already has it) and then make sure cdk has access to typescript and all nodejs packages are available:

```bash
git clone git@github.com:lukaszbudnik/aws-cdk-items-app.git
cd aws-cdk-items-app
# install required components
npm install -g cdk
npm install -g typescript
npm install link typescript
npm install
# check if cdk can synthesize the stacks
cdk synth
# build create-item lambda
cd lib/lambda/create-item
npm install
```

# Deploy

Run the following command to deploy the Database and Service stacks. Service stack requires `jwtIssuer` and `jwtAudience` parameters to be present.

> The JWT Authorizer is actually validated during the deploy. If you don't have a valid OIDC server the deployment will fail.
If you don't have OIDC server at hand, don't worry, I got you covered. See how super easy it is to set up Keycloak cluster on AWS EKS: YT

```bash
cdk bootstrap
cdk deploy --all --parameters Service:jwtIssuer=https://example.com/auth/realms/customer123 --parameters Service:jwtAudience=account
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
