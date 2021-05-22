const AWS = require('aws-sdk');
import { failure, success } from './libs/response-lib';

const stepFunctions = new AWS.StepFunctions();

export async function main(event, context) {
  const data = JSON.parse(event.body);

  const wait = data.timestamp;
  const jobId = event.pathParameters.id;

  const payload = {
    stateMachineArn: process.env.stateMachineARN,
    name: `job-state-machine-${jobId}`,
    input: JSON.stringify({
      wait,
      jobId,
    }),
  };

  try {
    await stepFunctions.startExecution({ ...payload }).promise();
    return success(event);
  } catch (e) {
    console.log(`ERROR = ${JSON.stringify(e, null, 2)}`);
    return failure({ status: false });
  }
}
