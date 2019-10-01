const Octokit = require("@octokit/rest");
const octokit = new Octokit();

octokit.pulls.list({ owner: "mblottiere", repo: "nightwatch" }).then(console.debug);
