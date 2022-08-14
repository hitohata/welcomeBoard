import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

interface IProps extends StackProps {
    stageSuffix: string
};

export class WelcomeBoardManagerFrontStack extends Stack {
    constructor(scope: Construct, id: string, props: IProps) {
        super(scope, id, props);

        const { stageSuffix } = props;

        const hostingBucket = new s3.Bucket(this, "HostingBucket", {
            bucketName: `${stageSuffix}`,
            removalPolicy: RemovalPolicy.DESTROY
        });

        const front = new cloudfront.CloudFrontWebDistribution(this, "managerFrontDistribution", {
        });

    }
}
