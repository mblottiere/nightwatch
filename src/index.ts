import Octokit from "@octokit/rest";

const octokit = new Octokit();

const REMIND_INTERVAL = 1000 * 60;

enum POLL_RESULT {
  NOTHING,
  REVIEWABLE,
}

function notifier(result: POLL_RESULT): void {
  if (result === POLL_RESULT.REVIEWABLE) {
    console.log("Yeah some music");
  }
  if (result === POLL_RESULT.NOTHING) {
    console.log("Nothing to do");
  }
}

async function checkPR({ owner, repo }: { owner: string; repo: string }): Promise<POLL_RESULT> {
  const { data: pullRequests } = await octokit.pulls.list({ owner, repo });
  const detailPromises = pullRequests
    .filter(pr => pr.state === "open")
    .map(pr => octokit.pulls.get({ owner, repo, pull_number: pr.number }));
  const details = await Promise.all(detailPromises);

  const reviewable = details.reduce(
    (acc: number, { data: pr }) => {
      if (!pr.mergeable) {
        return acc + 1;
      }
      return acc;
    },
    0
  );

  if (reviewable) {
    return POLL_RESULT.REVIEWABLE;
  }
  return POLL_RESULT.NOTHING;
}

setInterval(() => {
  checkPR({ owner: "mblottiere", repo: "nightwatch" }).then(notifier);
}, REMIND_INTERVAL);

checkPR({ owner: "mblottiere", repo: "nightwatch" }).then(notifier);
