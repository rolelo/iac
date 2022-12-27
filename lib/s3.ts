import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

class S3Stack extends cdk.Stack {
  public bucket: cdk.aws_s3.Bucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new cdk.aws_s3.Bucket(this, "Rolele-Public", {
      publicReadAccess: true,
    });
  }
}

export default S3Stack;
