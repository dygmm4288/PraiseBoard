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

const issues = ISSUES
  .split(",")
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
    throw new Error(JSON.stringify(json.errors, null, 2));
  }

  return json.data;
}

async function getIssueId(identifier) {
  const data = await graphql(
    `
      query($identifier: String!) {
        issueV2(identifier: $identifier) {
          id
        }
      }
    `,
    {
      identifier,
    },
  );

  if (!data.issueV2?.id) {
    throw new Error(`Issue not found: ${identifier}`);
  }

  return data.issueV2.id;
}

async function createComment(issueId, body) {
  await graphql(
    `
      mutation($input: CommentCreateInput!) {
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
  const body = `## ✅ QA Build

### 🤖 Android

${ANDROID_BUILD_URL || "-"}

### 🍏 iOS

${IOS_BUILD_URL || "-"}
`;

  for (const issue of issues) {
    console.log(`Commenting ${issue}`);

    const issueId = await getIssueId(issue);

    await createComment(issueId, body);
  }

  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
