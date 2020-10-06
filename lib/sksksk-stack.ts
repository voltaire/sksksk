import aliastarget = require('@aws-cdk/aws-route53-targets');
import iam = require('@aws-cdk/aws-iam');
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import subscriptions = require('@aws-cdk/aws-sns-subscriptions');
import * as cdk from '@aws-cdk/core';

export class SkskskStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const sepAccount = new iam.AccountPrincipal('006851364659')

    const deployGroup = new iam.Group(this, 'sksksk-deploy', {})

    const deployUser = new iam.User(this, 'deployUser', {
      groups: [deployGroup],
    })

    const mapBucket = s3.Bucket.fromBucketName(this, 'mapBucket', 'map.tonkat.su')
    mapBucket.grantReadWrite(deployGroup)

    const sepBucket = s3.Bucket.fromBucketName(this, 'sepBucket', 'mc.sep.gg-backups')
    sepBucket.grantRead(deployGroup)

    const backupNotificationTopic = new sns.Topic(this, "SkskskBackupTopic", {});
    backupNotificationTopic.grantPublish(sepAccount)
    backupNotificationTopic.addToResourcePolicy(new iam.PolicyStatement({
      actions: ["sns:Publish"],
      resources: [backupNotificationTopic.topicArn],
      principals: [new iam.ServicePrincipal("s3.amazonaws.com")],
      conditions: {
        ArnEquals: {"aws:SourceArn": sepBucket.bucketArn}
      },
    }))
    deployGroup.addToPolicy(new iam.PolicyStatement({
      actions: ["sns:Subscribe"],
      resources: [backupNotificationTopic.topicArn],
    }))

    const tonkatsuZone = route53.HostedZone.fromHostedZoneAttributes(this, 'tonkatsuZone', {
      hostedZoneId: 'ZVAMW53PNR70P',
      zoneName: 'tonkat.su',
    })
    new route53.ARecord(this, 'mapRecord', {
      zone: tonkatsuZone,
      recordName: 'map',
      target: route53.RecordTarget.fromAlias(new aliastarget.BucketWebsiteTarget(mapBucket))
    })
    const bungeeCordRecord = new route53.ARecord(this, 'bungeeCord', {
      zone: tonkatsuZone,
      recordName: 'mc',
      target: route53.RecordTarget.fromIpAddresses('173.255.249.198'),
    })
    new route53.CnameRecord(this, 'pumpcraft', {
      zone: tonkatsuZone,
      recordName: 'pumpcraft.mc',
      domainName: bungeeCordRecord.domainName,
    })
    new route53.ARecord(this, 'lobby', {
      zone: tonkatsuZone,
      recordName: 'lobby.mc',
      target: route53.RecordTarget.fromIpAddresses('192.168.223.121'),
    })

    new route53.ARecord(this, 'creative', {
      zone: tonkatsuZone,
      recordName: 'create.mc',
      target: route53.RecordTarget.fromIpAddresses('45.79.90.177'),
    })

    new route53.ARecord(this, 'creativePrivate', {
      zone: tonkatsuZone,
      recordName: 'create.mc.pvt',
      target: route53.RecordTarget.fromIpAddresses('192.168.214.189'),
    })
  }
}