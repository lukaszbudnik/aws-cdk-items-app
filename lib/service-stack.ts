import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigatewayv2";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers";
import { LambdaToDynamoDB } from "@aws-solutions-constructs/aws-lambda-dynamodb";
import { LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2-integrations";

export interface StackProps {
  readonly table: ddb.Table;
}

export class Service extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: StackProps) {
    super(scope, id);

    const jwtIssuer = new cdk.CfnParameter(this, "jwtIssuer", {
      type: "String",
      description: "The URL of JWT Issuer",
    });

    const jwtAudience = new cdk.CfnParameter(this, "jwtAudience", {
      type: "CommaDelimitedList",
      description: "The audience of the JWT token",
    });

    const authorizer = new HttpJwtAuthorizer({
      jwtAudience: jwtAudience.valueAsList,
      jwtIssuer: jwtIssuer.valueAsString,
    });

    const createItem = new LambdaToDynamoDB(this, "create-item", {
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(`${__dirname}/lambda/create-item`),
        handler: "index.handler",
        timeout: cdk.Duration.seconds(15),
      },
      existingTableObj: props.table,
    });

    const getItems = new LambdaToDynamoDB(this, "get-items", {
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(`${__dirname}/lambda/get-items`),
        handler: "index.handler",
        timeout: cdk.Duration.seconds(15),
      },
      existingTableObj: props.table,
    });

    const httpApi = new apigateway.HttpApi(this, "http-api-service");

    httpApi.addStage("dev", {
      stageName: "dev",
      autoDeploy: true,
    });

    httpApi.addRoutes({
      path: "/items",
      methods: [apigateway.HttpMethod.GET],
      integration: new LambdaProxyIntegration({
        handler: getItems.lambdaFunction,
      }),
    });

    httpApi.addRoutes({
      path: "/items",
      methods: [apigateway.HttpMethod.POST],
      integration: new LambdaProxyIntegration({
        handler: createItem.lambdaFunction,
      }),
      authorizer: authorizer,
    });
  }
}
