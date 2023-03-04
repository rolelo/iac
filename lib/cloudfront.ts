import {
  aws_certificatemanager as cm,
  aws_cloudfront as cf,
  aws_s3 as s3,
  aws_cloudfront_origins as origins,
} from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
export class Cloudfront extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    authS3Bucket: s3.Bucket,
    domainNames: string[],
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const arn =
      "arn:aws:acm:us-east-1:095812446517:certificate/82ebba95-606f-42b8-aa37-19986c341a4f";

    new cf.Distribution(this, "Rolelo Cloudfront Distribution", {
      domainNames,
      certificate: cm.Certificate.fromCertificateArn(
        this,
        "Rolelo Certificate",
        arn
      ),
      defaultBehavior: {
        allowedMethods: cf.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new origins.S3Origin(authS3Bucket),
      },
    });
  }
}
