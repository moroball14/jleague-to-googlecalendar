# jleague to google calendar

- CLIENT_ID と CLIENT_SECRET を取得する
- team_id は好きなチームの id を取得する
  - https://data.j-league.or.jp/SFMS01/back でチームを選択したら、URL に team_id が含まれている
- `npm run start` で実行する

# Usage

`src/main.ts` の `CLIENT_ID` と `CLIENT_SECRET` を書き換えてから以下を実行

```bash
$ npm run start -- --team_id=21
```
