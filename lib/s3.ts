import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

class S3Stack extends cdk.Stack {
  public bucket: cdk.aws_s3.Bucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new cdk.aws_s3.Bucket(this, "Rolele-Public", {
      cors: [
        {
          allowedMethods: [
            cdk.aws_s3.HttpMethods.POST,
            cdk.aws_s3.HttpMethods.GET,
            cdk.aws_s3.HttpMethods.DELETE,
            cdk.aws_s3.HttpMethods.PUT,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });
  }
}

export default S3Stack;
