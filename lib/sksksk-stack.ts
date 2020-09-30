import ecrasset = require('@aws-cdk/aws-ecr-assets');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import path = require('path');
import * as cdk from '@aws-cdk/core';

export class SkskskStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const sepAccount = new iam.AccountPrincipal('006851364659')

    const backupNotificationTopic = new sns.Topic(this, "SkskskBackupTopic", {});
    backupNotificationTopic.grantPublish(sepAccount)

    const mapBucket = new s3.Bucket(this, "SkskskWorldMaps", {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
    })

    const overviewerImage = new ecrasset.DockerImageAsset(this, 'overviewerImage', {
      directory: path.resolve(__dirname, 'overviewer'),
      repositoryName: 'overviewer',
    })

    const deployGroup = new iam.Group(this, 'sksksk-deploy', {})

    overviewerImage.repository.grantPull(deployGroup)
  }
}