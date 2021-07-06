#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { Database } from "../lib/database-stack";
import { Service } from "../lib/service-stack";

const app = new cdk.App();

const database = new Database(app, "Database");

const service = new Service(app, "Service", {
  table: database.table,
});
