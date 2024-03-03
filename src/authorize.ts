import { Auth, google } from "googleapis";
import readline from "readline";

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
  const tokens = await getTokens(auth, args.scopes);
  auth.setCredentials(tokens);
  return auth;
}

async function getTokens(
  auth: Auth.OAuth2Client,
  scopes: string[]
): Promise<any> {
  const url = auth.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("このURLにアクセスして認証コードを取得してください:", url);
  const code = await input("認証コードを入力してください: ");
  return new Promise((resolve, reject) => {
    auth.getToken(code, (err, tokens) => {
      if (err) {
        reject(err);
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
