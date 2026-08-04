const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

export async function getFileContent(path) {
  const response = await fetch(`${API_BASE}/${path}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  
  return {
    content,
    sha: data.sha
  };
}

export async function updateFileContent(path, content, sha, message) {
  const response = await fetch(`${API_BASE}/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message || `Update ${path}`,
      content: Buffer.from(content).toString('base64'),
      sha,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function createCommit(path, content, message) {
  const existingFile = await getFileContent(path);
  
  return updateFileContent(
    path,
    content,
    existingFile ? existingFile.sha : undefined,
    message || `Update ${path} via CMS`
  );
}
