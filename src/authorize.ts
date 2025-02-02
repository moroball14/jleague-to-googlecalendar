import { Auth, google } from "googleapis";
import path from "path";
import readline from "readline";
import fs from "fs";

const TOKEN_PATH = path.join(__dirname, "token.json");

export async function authorize(args: {
  clientId: string;
  clientSecret: string;
  scopes: string[];
}): Promise<Auth.OAuth2Client> {
  const auth = new google.auth.OAuth2(
    args.clientId,
    args.clientSecret,
    "http://localhost:8080/auth/google/callback" // optionalだけど、クライアントIDの「承認済みのリダイレクト URI」に登録したURLがないとredirect_uri_mismatch
  );

  let tokens: Auth.Credentials | null = loadTokens();

  if (!tokens) {
    tokens = await getTokens(auth, args.scopes);
    saveTokens(tokens);
  }

  auth.setCredentials(tokens);

  // トークンが期限切れの場合はリフレッシュ
  auth.on("tokens", (newTokens) => {
    if (newTokens.refresh_token) {
      tokens!.refresh_token = newTokens.refresh_token; // 既存のリフレッシュトークンを更新
      saveTokens(tokens!);
    }
  });

  return auth;
}

function loadTokens(): Auth.Credentials | null {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
      return tokens;
    }
  } catch (err) {
    console.error("トークンの読み込みに失敗しました:", err);
  }
  return null;
}

function saveTokens(tokens: Auth.Credentials) {
  try {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), "utf-8");
    console.log("トークンを保存しました");
  } catch (err) {
    console.error("トークンの保存に失敗しました:", err);
  }
}

async function getTokens(
  auth: Auth.OAuth2Client,
  scopes: string[]
): Promise<Auth.Credentials> {
  const url = auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
  console.log("このURLにアクセスして認証コードを取得してください:", url);
  const code = await input("認証コードを入力してください: ");
  return new Promise((resolve, reject) => {
    auth.getToken(code, (err, tokens) => {
      if (err) {
        reject(err);
      }
      if (!tokens) {
        reject(new Error("トークンが取得できませんでした"));
        return;
      }
      resolve(tokens);
    });
  });
}
async function input(message: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
