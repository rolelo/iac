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
    clientS3Bucket: s3.Bucket,
    organisationS3Bucket: s3.Bucket,
    domainNames: string[],
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const arn =
      "arn:aws:acm:us-east-1:619680812856:certificate/e481feed-d180-4bfe-87e5-f55a30d59c53";

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
      additionalBehaviors: {
        "/client": {
          origin: new origins.S3Origin(clientS3Bucket),
          allowedMethods: cf.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        "/organisation": {
          origin: new origins.S3Origin(organisationS3Bucket),
          allowedMethods: cf.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    });
  }
}
