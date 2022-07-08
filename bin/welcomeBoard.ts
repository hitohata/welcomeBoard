#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WelcomeBoardStack } from '../lib/welcome-board-stack';


/**
 * if deploy stage is prod, return nothing.
 * @param stage 
 * @returns 
 */
const deployStageSuffix = (stage?: string): string => {

    if (!stage) return "-dev"

    if (stage === "prod") return "";

    return `-${stage}`;
}


const app = new cdk.App();
new WelcomeBoardStack(app, 'WeddingStack', {
  deployStage: deployStageSuffix(process.env.DEPLOY_STAGE),
});
