import { authorize } from "./authorize";
import { HtmlToGoogleCalenderConverter } from "./converter";
import { Crawler } from "./crowller";
import { GoogleCalendarEventCreator } from "./googleCalenderEventCreator";
import { HtmlParser } from "./htmlParser";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";

async function main() {
  const year = "2024";
  // team_ids=21は川崎フロンターレ
  const crawler = new Crawler(
    `https://data.j-league.or.jp/SFMS01/search?competition_years=${year}&competition_frame_ids=1&team_ids=21&home_away_select=0&tv_relay_station_name=`
  );
  const html = await crawler.getRawHtml();
  const result = new HtmlParser(html).parse();
  const events = new HtmlToGoogleCalenderConverter().execute({
    html: result,
    year: "2024",
  });
  const auth = await authorize({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scopes: SCOPES,
  });
  const creator = new GoogleCalendarEventCreator(auth);
  await creator.bulkInsert([events[0]]);

  console.log(events);
}

main();
