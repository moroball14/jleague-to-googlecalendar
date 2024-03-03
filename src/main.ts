import { HtmlToGoogleCalenderConverter } from "./converter";
import { Crawler } from "./crowller";
import { HtmlParser } from "./htmlParser";

async function main() {
  const crawler = new Crawler(
    "https://data.j-league.or.jp/SFMS01/search?competition_years=2024&competition_frame_ids=1&competition_ids=589&tv_relay_station_name="
  );
  const html = await crawler.getRawHtml();
  const result = new HtmlParser(html).parse();
  const events = new HtmlToGoogleCalenderConverter().execute(result);
  console.log(events);
}

main();
