#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("aws-cdk-lib/aws-iam");
const sns = require("aws-cdk-lib/aws-sns");
const ssm = require("aws-cdk-lib/aws-ssm");
const cdk = require("aws-cdk-lib");
const custom_resources_1 = require("aws-cdk-lib/custom-resources");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-sdk-js');
const topic = new sns.Topic(stack, 'Topic');
const snsPublish = new custom_resources_1.AwsCustomResource(stack, 'Publish', {
    resourceType: 'Custom::SNSPublisher',
    onUpdate: {
        service: 'SNS',
        action: 'publish',
        parameters: {
            Message: 'hello',
            TopicArn: topic.topicArn,
        },
        physicalResourceId: custom_resources_1.PhysicalResourceId.of(topic.topicArn),
    },
    policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
});
const listTopics = new custom_resources_1.AwsCustomResource(stack, 'ListTopics', {
    onUpdate: {
        service: 'SNS',
        action: 'listTopics',
        physicalResourceId: custom_resources_1.PhysicalResourceId.fromResponse('Topics.0.TopicArn'),
    },
    policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
});
listTopics.node.addDependency(topic);
const ssmParameter = new ssm.StringParameter(stack, 'DummyParameter', {
    stringValue: '1337',
});
const getParameter = new custom_resources_1.AwsCustomResource(stack, 'GetParameter', {
    resourceType: 'Custom::SSMParameter',
    onUpdate: {
        service: 'SSM',
        action: 'getParameter',
        parameters: {
            Name: ssmParameter.parameterName,
            WithDecryption: true,
        },
        physicalResourceId: custom_resources_1.PhysicalResourceId.fromResponse('Parameter.ARN'),
    },
    policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
});
const customRole = new iam.Role(stack, 'CustomRole', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
customRole.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    actions: [
        'ssm:*',
    ],
}));
const getParameterNoPolicy = new custom_resources_1.AwsCustomResource(stack, 'GetParameterNoPolicy', {
    resourceType: 'Custom::SSMParameter',
    onUpdate: {
        service: 'SSM',
        action: 'getParameter',
        parameters: {
            Name: ssmParameter.parameterName,
            WithDecryption: true,
        },
        physicalResourceId: custom_resources_1.PhysicalResourceId.fromResponse('Parameter.ARN'),
    },
    role: customRole,
});
new cdk.CfnOutput(stack, 'MessageId', { value: snsPublish.getResponseField('MessageId') });
new cdk.CfnOutput(stack, 'TopicArn', { value: listTopics.getResponseField('Topics.0.TopicArn') });
new cdk.CfnOutput(stack, 'ParameterValue', { value: getParameter.getResponseField('Parameter.Value') });
new cdk.CfnOutput(stack, 'ParameterValueNoPolicy', { value: getParameterNoPolicy.getResponseField('Parameter.Value') });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXdzLWN1c3RvbS1yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmF3cy1jdXN0b20tcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLG1FQUE4RztBQUU5RyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFFbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU1QyxNQUFNLFVBQVUsR0FBRyxJQUFJLG9DQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7SUFDekQsWUFBWSxFQUFFLHNCQUFzQjtJQUNwQyxRQUFRLEVBQUU7UUFDUixPQUFPLEVBQUUsS0FBSztRQUNkLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLFVBQVUsRUFBRTtZQUNWLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUN6QjtRQUNELGtCQUFrQixFQUFFLHFDQUFrQixDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0tBQzFEO0lBQ0QsTUFBTSxFQUFFLDBDQUF1QixDQUFDLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBRSwwQ0FBdUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztDQUNsRyxDQUFDLENBQUM7QUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFJLG9DQUFpQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDNUQsUUFBUSxFQUFFO1FBQ1IsT0FBTyxFQUFFLEtBQUs7UUFDZCxNQUFNLEVBQUUsWUFBWTtRQUNwQixrQkFBa0IsRUFBRSxxQ0FB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ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgc3NtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zc20nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEF3c0N1c3RvbVJlc291cmNlLCBBd3NDdXN0b21SZXNvdXJjZVBvbGljeSwgUGh5c2ljYWxSZXNvdXJjZUlkIH0gZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLXNkay1qcycpO1xuXG5jb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdUb3BpYycpO1xuXG5jb25zdCBzbnNQdWJsaXNoID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnUHVibGlzaCcsIHtcbiAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpTTlNQdWJsaXNoZXInLFxuICBvblVwZGF0ZToge1xuICAgIHNlcnZpY2U6ICdTTlMnLFxuICAgIGFjdGlvbjogJ3B1Ymxpc2gnLFxuICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgIE1lc3NhZ2U6ICdoZWxsbycsXG4gICAgICBUb3BpY0FybjogdG9waWMudG9waWNBcm4sXG4gICAgfSxcbiAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZih0b3BpYy50b3BpY0FybiksXG4gIH0sXG4gIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG59KTtcblxuY29uc3QgbGlzdFRvcGljcyA9IG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0xpc3RUb3BpY3MnLCB7XG4gIG9uVXBkYXRlOiB7XG4gICAgc2VydmljZTogJ1NOUycsXG4gICAgYWN0aW9uOiAnbGlzdFRvcGljcycsXG4gICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQuZnJvbVJlc3BvbnNlKCdUb3BpY3MuMC5Ub3BpY0FybicpLFxuICB9LFxuICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxufSk7XG5saXN0VG9waWNzLm5vZGUuYWRkRGVwZW5kZW5jeSh0b3BpYyk7XG5cbmNvbnN0IHNzbVBhcmFtZXRlciA9IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnRHVtbXlQYXJhbWV0ZXInLCB7XG4gIHN0cmluZ1ZhbHVlOiAnMTMzNycsXG59KTtcbmNvbnN0IGdldFBhcmFtZXRlciA9IG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0dldFBhcmFtZXRlcicsIHtcbiAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpTU01QYXJhbWV0ZXInLFxuICBvblVwZGF0ZToge1xuICAgIHNlcnZpY2U6ICdTU00nLFxuICAgIGFjdGlvbjogJ2dldFBhcmFtZXRlcicsXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgTmFtZTogc3NtUGFyYW1ldGVyLnBhcmFtZXRlck5hbWUsXG4gICAgICBXaXRoRGVjcnlwdGlvbjogdHJ1ZSxcbiAgICB9LFxuICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnUGFyYW1ldGVyLkFSTicpLFxuICB9LFxuICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxufSk7XG5cbmNvbnN0IGN1c3RvbVJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdDdXN0b21Sb2xlJywge1xuICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbn0pO1xuY3VzdG9tUm9sZS5hZGRUb1BvbGljeShcbiAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIGFjdGlvbnM6IFtcbiAgICAgICdzc206KicsXG4gICAgXSxcbiAgfSksXG4pO1xuY29uc3QgZ2V0UGFyYW1ldGVyTm9Qb2xpY3kgPSBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdHZXRQYXJhbWV0ZXJOb1BvbGljeScsIHtcbiAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpTU01QYXJhbWV0ZXInLFxuICBvblVwZGF0ZToge1xuICAgIHNlcnZpY2U6ICdTU00nLFxuICAgIGFjdGlvbjogJ2dldFBhcmFtZXRlcicsXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgTmFtZTogc3NtUGFyYW1ldGVyLnBhcmFtZXRlck5hbWUsXG4gICAgICBXaXRoRGVjcnlwdGlvbjogdHJ1ZSxcbiAgICB9LFxuICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnUGFyYW1ldGVyLkFSTicpLFxuICB9LFxuICByb2xlOiBjdXN0b21Sb2xlLFxufSk7XG5cbm5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnTWVzc2FnZUlkJywgeyB2YWx1ZTogc25zUHVibGlzaC5nZXRSZXNwb25zZUZpZWxkKCdNZXNzYWdlSWQnKSB9KTtcbm5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnVG9waWNBcm4nLCB7IHZhbHVlOiBsaXN0VG9waWNzLmdldFJlc3BvbnNlRmllbGQoJ1RvcGljcy4wLlRvcGljQXJuJykgfSk7XG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ1BhcmFtZXRlclZhbHVlJywgeyB2YWx1ZTogZ2V0UGFyYW1ldGVyLmdldFJlc3BvbnNlRmllbGQoJ1BhcmFtZXRlci5WYWx1ZScpIH0pO1xubmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdQYXJhbWV0ZXJWYWx1ZU5vUG9saWN5JywgeyB2YWx1ZTogZ2V0UGFyYW1ldGVyTm9Qb2xpY3kuZ2V0UmVzcG9uc2VGaWVsZCgnUGFyYW1ldGVyLlZhbHVlJykgfSk7XG5cbmFwcC5zeW50aCgpO1xuIl19