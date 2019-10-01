import Octokit from "@octokit/rest";

const octokit = new Octokit();

//const REMIND_INTERVAL = 1000 * 60;
const REMIND_INTERVAL = 1000 * 10;

async function checkPR({ owner, repo }: { owner: string, repo: string }) {
  const test = await octokit.pulls.list({owner, repo});
  test.data.filter(pr => pr.state === 'open').forEach(pr => {
    console.debug('pr', pr);
  });
}

setInterval(() => {
  checkPR({ owner: 'mblottiere', repo: 'nightwatch'}).then()
}, REMIND_INTERVAL);
