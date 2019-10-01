const Octokit = require("@octokit/rest");
const octokit = new Octokit();

octokit.repos
  .listForOrg({
    org: "octokit",
    type: "public"
  })
  .then(({ data }) => {
    // handle data
    console.debug("data", data);
  });
