import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { authorize } from "./authorize";
import { HtmlToGoogleCalenderConverter } from "./converter";
import { Crawler } from "./crowller";
import { GoogleCalendarEventCreator } from "./googleCalenderEventCreator";
import { HtmlParser } from "./htmlParser";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";

async function main() {
  // コマンドライン引数を解析
  const argv = yargs(hideBin(process.argv))
    .options({
      year: {
        type: "number",
        description: "取得する試合の年",
        default: new Date().getFullYear(),
      },
      teamId: {
        type: "number",
        description: "取得するチームのID（例: 21=川崎フロンターレ）",
        demandOption: true,
      },
    })
    .parseSync();

  const { year, teamId } = argv;

  console.log(`Fetching data for year: ${year}, team_id: ${teamId}`);
  const crawler = new Crawler(
    `https://data.j-league.or.jp/SFMS01/search?competition_years=${year}&competition_frame_ids=1&team_ids=${teamId}&home_away_select=0&tv_relay_station_name=`
  );
  const html = await crawler.getRawHtml();
  const result = new HtmlParser(html).parse();
  const events = new HtmlToGoogleCalenderConverter().execute({
    html: result,
    year: year.toString(),
  });
  const auth = await authorize({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scopes: SCOPES,
  });
  const creator = new GoogleCalendarEventCreator(auth);
  await creator.bulkInsert(events);

  // ミスって作ったら
  // const deletor = new GoogleCalendarEventDeletor(auth);
  // await deletor.bulkDelete({
  //   keyword: "川崎Ｆ",
  //   timeMin: new Date("2025-02-01").toISOString(),
  // });

  console.log(events);
}

main();
