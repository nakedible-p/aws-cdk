import { Template } from 'aws-cdk-lib/assertions';
import * as iotevents from 'aws-cdk-lib/aws-iotevents-alpha';
import * as cdk from 'aws-cdk-lib';
import * as actions from '../../lib';

let stack: cdk.Stack;
let input: iotevents.IInput;
beforeEach(() => {
  stack = new cdk.Stack();
  input = iotevents.Input.fromInputName(stack, 'MyInput', 'test-input');
});

test('Default property', () => {
  // WHEN
  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    initialState: new iotevents.State({
      stateName: 'test-state',
      onEnter: [{
        eventName: 'test-eventName',
        condition: iotevents.Expression.currentInput(input),
        actions: [
          new actions.ClearTimerAction('MyTimer'),
        ],
      }],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      States: [{
        OnEnter: {
          Events: [{
            Actions: [{
              ClearTimer: {
                TimerName: 'MyTimer',
              },
            }],
          }],
        },
      }],
    },
  });
});
