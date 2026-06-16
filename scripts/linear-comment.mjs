const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

const ISSUES = process.env.ISSUES;
const ANDROID_BUILD_URL = process.env.ANDROID_BUILD_URL ?? "";
const IOS_BUILD_URL = process.env.IOS_BUILD_URL ?? "";

if (!LINEAR_API_KEY) {
  throw new Error("LINEAR_API_KEY is missing");
}

if (!ISSUES) {
  throw new Error("ISSUES is missing");
}

const issues = ISSUES.split(",")
  .map((v) => v.trim())
  .filter(Boolean);

async function graphql(query, variables = {}) {
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      Authorization: LINEAR_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error("GraphQL request failed");
  }

  return json.data;
}

async function loadIssueMap() {
  const data = await graphql(`
    query {
      issues(first: 100) {
        nodes {
          id
          identifier
        }
      }
    }
  `);

  return new Map(
    data.issues.nodes.map((issue) => [
      issue.identifier.toLowerCase(),
      issue.id,
    ]),
  );
}

async function createComment(issueId, body) {
  return graphql(
    `
      mutation CommentCreate($input: CommentCreateInput!) {
        commentCreate(input: $input) {
          success
        }
      }
    `,
    {
      input: {
        issueId,
        body,
      },
    },
  );
}

async function main() {
  const issueMap = await loadIssueMap();

  const body = `## ✅ QA Build

### 🤖 Android

${ANDROID_BUILD_URL || "-"}

### 🍏 iOS

${IOS_BUILD_URL || "-"}
`;

  for (const issueIdentifier of issues) {
    const issueId = issueMap.get(issueIdentifier.toLowerCase());

    if (!issueId) {
      throw new Error(`Issue not found: ${issueIdentifier}`);
    }

    console.log(`Commenting ${issueIdentifier} (${issueId})`);

    const result = await createComment(issueId, body);

    console.log(JSON.stringify(result, null, 2));
  }

  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
