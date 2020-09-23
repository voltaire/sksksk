import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');
import path = require('path');
import * as cdk from '@aws-cdk/core';
import { eventNames } from 'process';

export class SkskskStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = new ec2.Vpc(this, 'SkskskVpc', { maxAzs: 3 })

    new ec2.InterfaceVpcEndpoint(this, 'CloudwatchLogsVpcEndpoint', {
      vpc: vpc,
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    })

    new ec2.InterfaceVpcEndpoint(this, 'ECRVpcEndpoint', {
      vpc: vpc,
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
    })

    new ec2.InterfaceVpcEndpoint(this, 'ECRDockerVpcEndpoint', {
      vpc: vpc,
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
    })

    new ec2.GatewayVpcEndpoint(this, 'S3VpcEndpoint', {
      vpc: vpc,
      service: ec2.GatewayVpcEndpointAwsService.S3,
    })

    const logging = new ecs.AwsLogDriver({
      streamPrefix: "sksksk",
    })

    const sepAccount = new iam.AccountPrincipal('006851364659')

    events.EventBus.grantPutEvents(sepAccount)

    const backupCreatedEventBridge = new events.EventBus(this, "SkskskBackupEvent")

    const backupCreatedRule = new events.Rule(this, "SkskskBackupEventRule", {
      eventBus: backupCreatedEventBridge,
      enabled: true,
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
    const cluster = new ecs.Cluster(this, 'SkskskCluster', { vpc });

    const taskDef = new ecs.FargateTaskDefinition(this, "SkskskTaskDefinition", {
      memoryLimitMiB: 8192,
      cpu: 4096,
    })

    taskDef.addContainer("Spigot", {
      image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'spigot_image')),
      logging,
    })

    /*
    new ecs.FargateService(this, "SkskskService", {
      cluster,
      taskDefinition: taskDef
    });
    */

    const backupNotificationTopic = new sns.Topic(this, "SkskskBackupTopic", {});
  }
}