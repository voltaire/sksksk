import aliastarget = require('@aws-cdk/aws-route53-targets');
import ecrasset = require('@aws-cdk/aws-ecr-assets');
import iam = require('@aws-cdk/aws-iam');
import route53 = require('@aws-cdk/aws-route53');
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

    const deployGroup = new iam.Group(this, 'sksksk-deploy', {})

    const deployUser = new iam.User(this, 'deployUser', {
      groups: [deployGroup],
    })

    const overviewerImage = new ecrasset.DockerImageAsset(this, 'overviewerImage', {
      directory: path.resolve(__dirname, 'overviewer'),
      repositoryName: 'overviewer',
    })
    overviewerImage.repository.grantPull(deployGroup)

    const mapBucket = s3.Bucket.fromBucketName(this, 'mapBucket', 'map.tonkat.su')
    mapBucket.grantReadWrite(deployGroup)

    const sepBucket = s3.Bucket.fromBucketName(this, 'sepBucket', 'mc.sep.gg-backups')
    sepBucket.grantRead(deployGroup)

    const tonkatsuZone = route53.HostedZone.fromHostedZoneAttributes(this, 'tonkatsuZone', {
      hostedZoneId: 'ZVAMW53PNR70P',
      zoneName: 'tonkat.su',
    })
    new route53.ARecord(this, 'mapRecord', {
      zone: tonkatsuZone,
      recordName: 'map',
      target: route53.RecordTarget.fromAlias(new aliastarget.BucketWebsiteTarget(mapBucket))
    })
  }
}