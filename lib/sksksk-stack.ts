import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import events = require('@aws-cdk/aws-events');
import eventstargets = require('@aws-cdk/aws-events-targets');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import path = require('path');
import * as cdk from '@aws-cdk/core';
import { eventNames } from 'process';

export class SkskskStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = new ec2.Vpc(this, 'SkskskVpc', { maxAzs: 3 })

    const sg = new ec2.SecurityGroup(this, 'SkskskTaskSecurityGroup', {
      vpc: vpc,
      allowAllOutbound: true,
    })

    new ec2.InterfaceVpcEndpoint(this, 'CloudwatchLogsVpcEndpoint', {
      vpc: vpc,
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      securityGroups: [sg],
    })

    new ec2.InterfaceVpcEndpoint(this, 'ECRVpcEndpoint', {
      vpc: vpc,
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
      securityGroups: [sg],
    })

    new ec2.InterfaceVpcEndpoint(this, 'ECRDockerVpcEndpoint', {
      vpc: vpc,
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
      securityGroups: [sg],
    })

    new ec2.GatewayVpcEndpoint(this, 'S3VpcEndpoint', {
      vpc: vpc,
      service: ec2.GatewayVpcEndpointAwsService.S3,
    })

    const logging = new ecs.AwsLogDriver({
      streamPrefix: "sksksk",
    })

    const cluster = new ecs.Cluster(this, 'SkskskCluster', { vpc });

    const taskDef = new ecs.FargateTaskDefinition(this, "SkskskTaskDefinition", {
      memoryLimitMiB: 8192,
      cpu: 4096,
    })

    taskDef.addContainer("Spigot", {
      image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'spigot_image')),
      logging,
    })

    const sepAccount = new iam.AccountPrincipal('006851364659')

    events.EventBus.grantPutEvents(sepAccount)

    const backupCreatedEventBridge = new events.EventBus(this, "SkskskBackupEvent")

    const taskTarget = new eventstargets.EcsTask({
      cluster: cluster,
      taskDefinition: taskDef,
      securityGroup: sg,
      taskCount: 1,
    })

    const backupCreatedRule = new events.Rule(this, "SkskskBackupEventRule", {
      eventBus: backupCreatedEventBridge,
      enabled: true,
      targets: [taskTarget],
      eventPattern: {
        account: ["006851364659"],
        source: ["aws.s3"],
        detail:{
          "eventName": ["PutObject"],
          "requestParameters": {
            "bucketName": ["mc.sep.gg-backups"],
          }
        }
      },
    })

    const mapBucket = new s3.Bucket(this, "SkskskWorldMaps", {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
    })

    const backupNotificationTopic = new sns.Topic(this, "SkskskBackupTopic", {});
  }
}