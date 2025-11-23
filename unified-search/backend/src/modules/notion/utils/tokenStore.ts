// Shared token store for Notion OAuth token
let notionOAuthToken: string | null = null;

export function setNotionOAuthToken(token: string) {
  notionOAuthToken = token;
  console.log("✅ Notion OAuth token stored");
}

export function getNotionOAuthToken(): string | null {
  return notionOAuthToken;
}

