import * as cdk from "aws-cdk-lib";
import { KubectlV24Layer } from "@aws-cdk/lambda-layer-kubectl-v24";
import { Construct } from "constructs";

export class KubernetesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const cluster = new cdk.aws_eks.Cluster(this, "rolelo-eks", {
      version: cdk.aws_eks.KubernetesVersion.V1_24,
      kubectlLayer: new KubectlV24Layer(this, "kubectl"),
    });

    const adminUser = new cdk.aws_iam.User(this, 'Admin')
    cluster.awsAuth.addUserMapping(adminUser, { groups: [ 'system:masters' ]})
  }
}
