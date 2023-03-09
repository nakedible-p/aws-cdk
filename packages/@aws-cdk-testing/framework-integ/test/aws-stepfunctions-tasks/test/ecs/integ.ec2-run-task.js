"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * * Creates a state machine with a task state to run a job with ECS on EC2
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-sfn-tasks-ecs-ec2-integ');
const cluster = new ecs.Cluster(stack, 'Ec2Cluster');
cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
});
// Build task definition
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
const containerDefinition = taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
    memoryLimitMiB: 256,
    logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});
// Build state machine
const definition = new sfn.Pass(stack, 'Start', {
    result: sfn.Result.fromObject({ SomeKey: 'SomeValue' }),
}).next(new tasks.EcsRunTask(stack, 'Run', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster,
    taskDefinition,
    containerOverrides: [
        {
            containerDefinition,
            environment: [
                {
                    name: 'SOME_KEY',
                    value: sfn.JsonPath.stringAt('$.SomeKey'),
                },
            ],
        },
    ],
    launchTarget: new tasks.EcsEc2LaunchTarget(),
}));
const sm = new sfn.StateMachine(stack, 'StateMachine', {
    definition,
});
new cdk.CfnOutput(stack, 'stateMachineArn', {
    value: sm.stateMachineArn,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWMyLXJ1bi10YXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWMyLXJ1bi10YXNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MscURBQXFEO0FBQ3JELG1DQUFtQztBQUNuQyw2REFBNkQ7QUFFN0Q7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBRWhFLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDckQsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRTtJQUM3QyxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztJQUM5QyxVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7Q0FDbEQsQ0FBQyxDQUFDO0FBRUgsd0JBQXdCO0FBQ3hCLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRSxNQUFNLG1CQUFtQixHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFO0lBQ3RFLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xGLGNBQWMsRUFBRSxHQUFHO0lBQ25CLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLENBQUM7Q0FDN0QsQ0FBQyxDQUFDO0FBRUgsc0JBQXNCO0FBQ3RCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0lBQzlDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQztDQUN4RCxDQUFDLENBQUMsSUFBSSxDQUNMLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0lBQ2pDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPO0lBQ2xELE9BQU87SUFDUCxjQUFjO0lBQ2Qsa0JBQWtCLEVBQUU7UUFDbEI7WUFDRSxtQkFBbUI7WUFDbkIsV0FBVyxFQUFFO2dCQUNYO29CQUNFLElBQUksRUFBRSxVQUFVO29CQUNoQixLQUFLLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO2lCQUMxQzthQUNGO1NBQ0Y7S0FDRjtJQUNELFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsRUFBRTtDQUM3QyxDQUFDLENBQ0gsQ0FBQztBQUVGLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO0lBQ3JELFVBQVU7Q0FDWCxDQUFDLENBQUM7QUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO0lBQzFDLEtBQUssRUFBRSxFQUFFLENBQUMsZUFBZTtDQUMxQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyB0YXNrcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcyc7XG5cbi8qXG4gKiAqIENyZWF0ZXMgYSBzdGF0ZSBtYWNoaW5lIHdpdGggYSB0YXNrIHN0YXRlIHRvIHJ1biBhIGpvYiB3aXRoIEVDUyBvbiBFQzJcbiAqXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiBUaGUgZ2VuZXJhdGVkIFN0YXRlIE1hY2hpbmUgY2FuIGJlIGV4ZWN1dGVkIGZyb20gdGhlIENMSSAob3IgU3RlcCBGdW5jdGlvbnMgY29uc29sZSlcbiAqIGFuZCBydW5zIHdpdGggYW4gZXhlY3V0aW9uIHN0YXR1cyBvZiBgU3VjY2VlZGVkYC5cbiAqXG4gKiAtLSBhd3Mgc3RlcGZ1bmN0aW9ucyBzdGFydC1leGVjdXRpb24gLS1zdGF0ZS1tYWNoaW5lLWFybiA8c3RhdGUtbWFjaGluZS1hcm4tZnJvbS1vdXRwdXQ+IHByb3ZpZGVzIGV4ZWN1dGlvbiBhcm5cbiAqIC0tIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPHN0YXRlLW1hY2hpbmUtYXJuLWZyb20tb3V0cHV0PiByZXR1cm5zIGEgc3RhdHVzIG9mIGBTdWNjZWVkZWRgXG4gKi9cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLXNmbi10YXNrcy1lY3MtZWMyLWludGVnJyk7XG5cbmNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFYzJDbHVzdGVyJyk7XG5jbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSxcbn0pO1xuXG4vLyBCdWlsZCB0YXNrIGRlZmluaXRpb25cbmNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbmNvbnN0IGNvbnRhaW5lckRlZmluaXRpb24gPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ1RoZUNvbnRhaW5lcicsIHtcbiAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tQXNzZXQocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2V2ZW50aGFuZGxlci1pbWFnZScpKSxcbiAgbWVtb3J5TGltaXRNaUI6IDI1NixcbiAgbG9nZ2luZzogbmV3IGVjcy5Bd3NMb2dEcml2ZXIoeyBzdHJlYW1QcmVmaXg6ICdFdmVudERlbW8nIH0pLFxufSk7XG5cbi8vIEJ1aWxkIHN0YXRlIG1hY2hpbmVcbmNvbnN0IGRlZmluaXRpb24gPSBuZXcgc2ZuLlBhc3Moc3RhY2ssICdTdGFydCcsIHtcbiAgcmVzdWx0OiBzZm4uUmVzdWx0LmZyb21PYmplY3QoeyBTb21lS2V5OiAnU29tZVZhbHVlJyB9KSxcbn0pLm5leHQoXG4gIG5ldyB0YXNrcy5FY3NSdW5UYXNrKHN0YWNrLCAnUnVuJywge1xuICAgIGludGVncmF0aW9uUGF0dGVybjogc2ZuLkludGVncmF0aW9uUGF0dGVybi5SVU5fSk9CLFxuICAgIGNsdXN0ZXIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gICAgY29udGFpbmVyT3ZlcnJpZGVzOiBbXG4gICAgICB7XG4gICAgICAgIGNvbnRhaW5lckRlZmluaXRpb24sXG4gICAgICAgIGVudmlyb25tZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1NPTUVfS0VZJyxcbiAgICAgICAgICAgIHZhbHVlOiBzZm4uSnNvblBhdGguc3RyaW5nQXQoJyQuU29tZUtleScpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgbGF1bmNoVGFyZ2V0OiBuZXcgdGFza3MuRWNzRWMyTGF1bmNoVGFyZ2V0KCksXG4gIH0pLFxuKTtcblxuY29uc3Qgc20gPSBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ1N0YXRlTWFjaGluZScsIHtcbiAgZGVmaW5pdGlvbixcbn0pO1xuXG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ3N0YXRlTWFjaGluZUFybicsIHtcbiAgdmFsdWU6IHNtLnN0YXRlTWFjaGluZUFybixcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==