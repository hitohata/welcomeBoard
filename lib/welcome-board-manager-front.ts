import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as path from "path";

interface IProps extends StackProps {
    stageSuffix: string
};

export class WelcomeBoardManagerFrontStack extends Stack {
    constructor(scope: Construct, id: string, props: IProps) {
        super(scope, id, props);

        const { stageSuffix } = props;

        const hostingBucket = new s3.Bucket(this, "HostingBucket", {
            bucketName: `message-manager-console${stageSuffix}`,
            removalPolicy: RemovalPolicy.DESTROY
        });

        const front = new cloudfront.Distribution(this, "managerFrontDistribution", {
            defaultBehavior: {
                origin: new origins.S3Origin(hostingBucket),
                cachePolicy: new cloudfront.CachePolicy(this, "managerFrontCache", {
                    defaultTtl: Duration.seconds(0)
                })
            },
            defaultRootObject: "index.html",
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: "./index.html"
                }
            ]
        });

        new s3deploy.BucketDeployment(this, "MessageConsole", {
            sources: [
                s3deploy.Source.asset(path.join(__dirname, "../manager-console/build")),
            ],
            destinationBucket: hostingBucket,
        });

    }
}
