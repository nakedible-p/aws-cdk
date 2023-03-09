"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const assets = require("aws-cdk-lib/aws-ecr-assets");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-assets-docker');
const asset = new assets.DockerImageAsset(stack, 'DockerImage', {
    directory: path.join(__dirname, 'demo-image'),
});
const asset2 = new assets.DockerImageAsset(stack, 'DockerImage2', {
    directory: path.join(__dirname, 'demo-image'),
});
const asset3 = new assets.DockerImageAsset(stack, 'DockerImage3', {
    directory: path.join(__dirname, 'demo-image'),
    platform: assets.Platform.LINUX_ARM64,
});
const asset4 = new assets.DockerImageAsset(stack, 'DockerImage4', {
    directory: path.join(__dirname, 'demo-image'),
    outputs: ['type=docker'],
});
const asset5 = new assets.DockerImageAsset(stack, 'DockerImage5', {
    directory: path.join(__dirname, 'demo-image-secret'),
    buildSecrets: {
        mysecret: cdk.DockerBuildSecret.fromSrc('index.py'),
    },
});
const user = new iam.User(stack, 'MyUser');
asset.repository.grantPull(user);
asset2.repository.grantPull(user);
asset3.repository.grantPull(user);
asset4.repository.grantPull(user);
asset5.repository.grantPull(user);
new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });
new cdk.CfnOutput(stack, 'ImageUri2', { value: asset2.imageUri });
new cdk.CfnOutput(stack, 'ImageUri3', { value: asset3.imageUri });
new cdk.CfnOutput(stack, 'ImageUri4', { value: asset4.imageUri });
new cdk.CfnOutput(stack, 'ImageUri5', { value: asset5.imageUri });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLWRvY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmFzc2V0cy1kb2NrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyxxREFBcUQ7QUFFckQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0FBRXhELE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7SUFDOUQsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztDQUM5QyxDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO0lBQ2hFLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUM7Q0FDOUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUNoRSxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO0lBQzdDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVc7Q0FDdEMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUNoRSxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO0lBQzdDLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQztDQUN6QixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO0lBQ2hFLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQztJQUNwRCxZQUFZLEVBQUU7UUFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7S0FDcEQ7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWxDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRWxFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgYXNzZXRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3ItYXNzZXRzJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdpbnRlZy1hc3NldHMtZG9ja2VyJyk7XG5cbmNvbnN0IGFzc2V0ID0gbmV3IGFzc2V0cy5Eb2NrZXJJbWFnZUFzc2V0KHN0YWNrLCAnRG9ja2VySW1hZ2UnLCB7XG4gIGRpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbW8taW1hZ2UnKSxcbn0pO1xuXG5jb25zdCBhc3NldDIgPSBuZXcgYXNzZXRzLkRvY2tlckltYWdlQXNzZXQoc3RhY2ssICdEb2NrZXJJbWFnZTInLCB7XG4gIGRpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbW8taW1hZ2UnKSxcbn0pO1xuXG5jb25zdCBhc3NldDMgPSBuZXcgYXNzZXRzLkRvY2tlckltYWdlQXNzZXQoc3RhY2ssICdEb2NrZXJJbWFnZTMnLCB7XG4gIGRpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbW8taW1hZ2UnKSxcbiAgcGxhdGZvcm06IGFzc2V0cy5QbGF0Zm9ybS5MSU5VWF9BUk02NCxcbn0pO1xuXG5jb25zdCBhc3NldDQgPSBuZXcgYXNzZXRzLkRvY2tlckltYWdlQXNzZXQoc3RhY2ssICdEb2NrZXJJbWFnZTQnLCB7XG4gIGRpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbW8taW1hZ2UnKSxcbiAgb3V0cHV0czogWyd0eXBlPWRvY2tlciddLFxufSk7XG5cbmNvbnN0IGFzc2V0NSA9IG5ldyBhc3NldHMuRG9ja2VySW1hZ2VBc3NldChzdGFjaywgJ0RvY2tlckltYWdlNScsIHtcbiAgZGlyZWN0b3J5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZGVtby1pbWFnZS1zZWNyZXQnKSxcbiAgYnVpbGRTZWNyZXRzOiB7XG4gICAgbXlzZWNyZXQ6IGNkay5Eb2NrZXJCdWlsZFNlY3JldC5mcm9tU3JjKCdpbmRleC5weScpLFxuICB9LFxufSk7XG5cbmNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdNeVVzZXInKTtcbmFzc2V0LnJlcG9zaXRvcnkuZ3JhbnRQdWxsKHVzZXIpO1xuYXNzZXQyLnJlcG9zaXRvcnkuZ3JhbnRQdWxsKHVzZXIpO1xuYXNzZXQzLnJlcG9zaXRvcnkuZ3JhbnRQdWxsKHVzZXIpO1xuYXNzZXQ0LnJlcG9zaXRvcnkuZ3JhbnRQdWxsKHVzZXIpO1xuYXNzZXQ1LnJlcG9zaXRvcnkuZ3JhbnRQdWxsKHVzZXIpO1xuXG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ0ltYWdlVXJpJywgeyB2YWx1ZTogYXNzZXQuaW1hZ2VVcmkgfSk7XG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ0ltYWdlVXJpMicsIHsgdmFsdWU6IGFzc2V0Mi5pbWFnZVVyaSB9KTtcbm5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnSW1hZ2VVcmkzJywgeyB2YWx1ZTogYXNzZXQzLmltYWdlVXJpIH0pO1xubmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdJbWFnZVVyaTQnLCB7IHZhbHVlOiBhc3NldDQuaW1hZ2VVcmkgfSk7XG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ0ltYWdlVXJpNScsIHsgdmFsdWU6IGFzc2V0NS5pbWFnZVVyaSB9KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=