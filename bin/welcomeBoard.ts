#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WelcomeBoardStack } from '../lib/welcome-board-stack';
import { WelcomeBoardManagerStack } from '../lib/welcome-board-management-stack';
import { WelcomeBoardManagerFrontStack } from "../lib/welcome-board-manager-front";


/**
 * if deploy stage is prod, return nothing.
 * @param stage 
 * @returns 
 */
const deployStageSuffix = (stage?: string): string => {

    if (!stage) {
      return "-dev";
		}

    if (stage === "prod") {
      return "";
    };

    return `-${stage}`;
}

const stageSuffix = deployStageSuffix(process.env.DEPLOY_STAGE)

const app = new cdk.App();
const manager = new WelcomeBoardManagerStack(app, `WelcomeMessageManagerStack${stageSuffix}`, {deployStageSuffix: stageSuffix});
new WelcomeBoardStack(app, `WelcomeMessageStack${stageSuffix}`, {
  stageSuffix: stageSuffix,
  tableArn: manager.tableArn()
});
new WelcomeBoardManagerFrontStack(app, `WelcomeMessageFrontStack${stageSuffix}`, {
  stageSuffix: stageSuffix
})
