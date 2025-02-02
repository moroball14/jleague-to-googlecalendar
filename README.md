# jleague to google calendar

- client id と client secret を取得する
- team_id は好きなチームの id を取得する
  - https://data.j-league.or.jp/SFMS01/back でチームを選択したら、URL に team_id が含まれている
- 上記の情報をもとに各変数を変更する
- `npm run start` で実行する

# Usage

```bash
$ npm run start -- --team_id=21
```
