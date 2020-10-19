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

    deployGroup.addToPolicy(new iam.PolicyStatement({
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
      resources: ["*"],
    }))

    const deployUser = new iam.User(this, 'deployUser', {
      groups: [deployGroup],
    })

    const tonkatsuZone = route53.HostedZone.fromHostedZoneAttributes(this, 'tonkatsuZone', {
      hostedZoneId: 'ZVAMW53PNR70P',
      zoneName: 'tonkat.su',
    })

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
      actions: ["sns:Subscribe", "sns:ConfirmSubscription"],
      resources: [backupNotificationTopic.topicArn],
    }))

    new route53.CnameRecord(this, 'mapCname', {
      zone: tonkatsuZone,
      recordName: 'map',
      domainName: 'map.tonkat.su.website-us-east-1.linodeobjects.com',
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

    const rendererRecord = new route53.ARecord(this, 'renderer', {
      zone: tonkatsuZone,
      recordName: 'renderer',
      target: route53.RecordTarget.fromIpAddresses('162.253.155.33'),
    })

    const escapeRecord = new route53.ARecord(this, 'escapeA', {
      zone: tonkatsuZone,
      recordName: 'escape.mc',
      target: route53.RecordTarget.fromIpAddresses('162.253.155.33'),
    })

    new route53.SrvRecord(this, 'escapeSrv', {
      zone: tonkatsuZone,
      recordName: '_minecraft._tcp.escape.mc',
      values: [{
        hostName: escapeRecord.domainName,
        port: 25567,
        priority: 1,
        weight: 0,
      }],
    })

    backupNotificationTopic.addSubscription(new subscriptions.UrlSubscription('https://'+rendererRecord.domainName+'/callback', {protocol: sns.SubscriptionProtocol.HTTPS}))

    const legoGroup = new iam.Group(this, "legoGroup", {})

    legoGroup.addToPolicy(new iam.PolicyStatement({
      actions: [
        "route53:ChangeResourceRecordSets",
        "route53:ListResourceRecordSets",
      ],
      resources: [tonkatsuZone.hostedZoneArn],
    }))

    legoGroup.addToPolicy(new iam.PolicyStatement({
      actions: ["route53:GetChange"],
      resources: ["arn:aws:route53:::change/*"],
    }))

    legoGroup.addToPolicy(new iam.PolicyStatement({
      actions: ["route53:ListHostedZonesByName"],
      resources: ["*"],
    }))

    legoGroup.addToPolicy(new iam.PolicyStatement({
      actions: [
        "secretsmanager:GetSecretValue",
        "secretsManager:CreateSecret",
      ],
      resources: ["*"],
      conditions: {
        "StringEquals": {
          "secretsmanager:ResourceTag/service": "map-cert",
        },
      },
    }))

    const legoUser = new iam.User(this, "legoUser", {
      groups: [legoGroup],
    })
  }
}