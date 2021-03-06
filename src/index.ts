import { spawn } from "child_process";
import Octokit from "@octokit/rest";

const octokit = new Octokit();

const OWNER = "mblottiere";
const REPO = "nightwatch";

const REMIND_INTERVAL = 1000 * 60;

enum POLL_RESULT {
  NOTHING,
  REVIEWABLE
}

function notifier(result: POLL_RESULT): void {
  if (result === POLL_RESULT.REVIEWABLE) {
    console.log("Yeah some music");
    const process = spawn("pmidi", ["-p", "128:0", "./songs/imperial.mid"]);
    process.on("error", err => {
      console.error("Failed to play midi:", err);
    });
  }
  if (result === POLL_RESULT.NOTHING) {
    console.log("Nothing to do");
  }
}

async function checkPR({
  owner,
  repo
}: {
  owner: string;
  repo: string;
}): Promise<POLL_RESULT> {
  const { data: pullRequests } = await octokit.pulls.list({ owner, repo });
  const detailPromises = pullRequests
    .filter(pr => pr.state === "open")
    .map(pr =>
      octokit.pulls.listReviews({ owner, repo, pull_number: pr.number })
    );
  const details = await Promise.all(detailPromises);

  const reviewable = details.reduce((acc: number, { data: reviews }) => {
    const approved = reviews.reduce(
      (acc: number, review) => (review.state === "APPROVED" ? acc + 1 : acc),
      0
    );
    return !approved ? acc + 1 : acc;
  }, 0);

  if (reviewable) {
    return POLL_RESULT.REVIEWABLE;
  }
  return POLL_RESULT.NOTHING;
}

setInterval(() => {
  checkPR({ owner: OWNER, repo: REPO }).then(notifier);
}, REMIND_INTERVAL);

checkPR({ owner: OWNER, repo: REPO }).then(notifier);
