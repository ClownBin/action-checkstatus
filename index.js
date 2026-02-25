const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    let token = core.getInput('github-token');
    if (!token) {
      token = process.env.GITHUB_TOKEN;
    }

    if (!token) {
      throw new Error('GitHub token is required. Provide it via input "github-token" or GITHUB_TOKEN env.');
    }

    const failOnNonSuccess =
      (core.getInput('fail-on-non-success') || '').toLowerCase() === 'true';

    const runId = process.env.GITHUB_RUN_ID;
    if (!runId) {
      throw new Error('GITHUB_RUN_ID environment variable is not available.');
    }

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    const { data: run } = await octokit.rest.actions.getWorkflowRun({
      owner,
      repo,
      run_id: runId
    });

    core.info(`Run ID: ${run.id}`);
    core.info(`Status: ${run.status}`); // queued, in_progress, completed
    core.info(`Conclusion: ${run.conclusion}`); // success, failure, cancelled, etc.

    core.setOutput('run-id', String(run.id));
    core.setOutput('status', run.status || '');
    core.setOutput('conclusion', run.conclusion || '');

    if (
      failOnNonSuccess &&
      run.status === 'completed' &&
      run.conclusion &&
      run.conclusion !== 'success'
    ) {
      core.setFailed(
        `Current workflow run is completed with conclusion: ${run.conclusion}`
      );
    }
  } catch (error) {
    core.setFailed(error.message || String(error));
  }
}

run();

