import { LinearClient } from '@linear/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  throw new Error("LINEAR_API_KEY environment variable is not set.");
}

const linearClient = new LinearClient({
  apiKey: LINEAR_API_KEY,
});

// TODO The Linear API does not seem to expose a way to figure out which GitHub
// PR is linked to a given Linear issue.
//
// That said, we can figure it out ourselves by looking for the GitHub PR
// comment posted by the Linear integration. This comment will contain a link to
// the Linear issue. By parsing the URL from this comment, you can determine
// which Linear issue the GitHub PR will close.
//
// If implementing this for real, I recommend employing the above strategy,
// using the GitHub API to request the comments for the PR.
//
// The implementation below assumes there is only one issue in your Linear
// project. This is just for the proof of concept.
async function getLinearIssue() {
  const issuesConnection = await linearClient.issues();
  return issuesConnection.nodes[0];
}

interface Payload {
  action: string;

  pull_request: {
    number: number;
  };
}

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  const payload = JSON.parse(request.body.payload) as Payload;

  if (payload.action !== "submitted") {
    response.send(undefined);
    return;
  }

  console.log(`Review submitted on PR ${payload.pull_request.number}.`);

  const linearIssue = await getLinearIssue();

  console.log(`The PR is linked to Linear issue ${linearIssue.identifier}.`);

  const linearIssueState = await linearIssue.state;

  if (
    !linearIssueState ||
    !["Backlog", "Todo", "In Progress", "In Review"].includes(
      linearIssueState.name
    )
  ) {
    const stateName = linearIssueState?.name ?? "undefined";

    console.log(
      `The Linear issue's state is ${stateName}. The state will not be changed.`
    );
    response.send(undefined);
    return;
  }

  // This could be optimized to not re-perform the query each time the webhook
  // fires
  const hasFeedbackState = await linearClient.workflowStates({
    filter: { name: { eq: "Has Feedback" } },
  });

  if (hasFeedbackState.nodes.length !== 1) {
    throw new Error(
      `Expected to get 1 workflow state with the name "Has Feedback" but got ${hasFeedbackState.nodes.length}.`
    );
  }

  await linearIssue.update({ stateId: hasFeedbackState.nodes[0].id });
  console.log(`Set the Linear issue's state to "Has Feedback".`);
  console.log();

  response.send(undefined);
}
