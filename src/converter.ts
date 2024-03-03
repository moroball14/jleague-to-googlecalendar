import {
  GoogleCalendarEvent,
  GoogleCalenderConverter,
} from "./interfaces/googleCalenderConverter";
import { HTMLElement } from "node-html-parser";

// executeでは以下のようなtable要素を持つHTML要素を受け取り、GoogleCalendarEventの配列を返す
// <table class="table-base00 search-table">
// 	<thead>
// 		<tr>
// 			<th class="bl-non nowrap">年度</th>
// 			<th class="nowrap">大会</th>
// 			<th class="nowrap">節</th>
// 			<th class="nowrap">試合日</th>
// 			<th class="nowrap">K/O時刻</th>
// 			<th class="nowrap">ホーム</th>
// 			<th class="nowrap">スコア</th>
// 			<th class="nowrap">アウェイ</th>
// 			<th class="nowrap">スタジアム</th>
// 			<th class="nowrap">入場者数</th>
// 			<th class="nowrap">インターネット中継・TV放送</th>
// 			</tr>
// 	</thead>
// 	<tbody>
// 		<tr>
// 				<td class="bl-non nowrap">2024</td>
// 				<td class="nowrap">Ｊ１ </td>
// 				<td class="nowrap">第１節第１日</td>
// 				<td class="nowrap">02/23(金・祝)</td>
// 				<td class="nowrap">14:06</td>
// 				<td class="nowrap">
// 					<a href="http://www.jleague.jp/club/hiroshima/profile/">広島</a>
// 				</td>
// 				<td class="al-c nowrap">
// 					<a href="/SFMS02/?match_card_id=30430">2-0</a>
// 				</td>
// 				<td class="nowrap">
// 					<a href="http://www.jleague.jp/club/urawa/profile/">浦和</a>
// 				</td>
// 				<td class="nowrap">Ｅピース</td>
// 				<td class="al-r nowrap">27,545</td>
// 				<td>ＤＡＺＮ／ＮＨＫ総合</td>
// 		</tr>
// 		<tr>
// 				<td class="bl-non nowrap">2024</td>
// 				<td class="nowrap">Ｊ１ </td>
// 				<td class="nowrap">第１節第１日</td>
// 				<td class="nowrap">02/23(金・祝)</td>
// 				<td class="nowrap">18:03</td>
// 				<td class="nowrap">
// 					<a href="http://www.jleague.jp/club/nagoya/profile/">名古屋</a>
// 				</td>
// 				<td class="al-c nowrap">
// 					<a href="/SFMS02/?match_card_id=30431">0-3</a>
// 				</td>
// 				<td class="nowrap">
// 					<a href="http://www.jleague.jp/club/kashima/profile/">鹿島</a>
// 				</td>
// 				<td class="nowrap">豊田ス</td>
// 				<td class="al-r nowrap">36,933</td>
// 				<td>ＤＡＺＮ</td>
// 		</tr>
// 	</tbody>
// </table>

export class HtmlToGoogleCalenderConverter
  implements GoogleCalenderConverter<HTMLElement>
{
  // eventに関しては、以下の要件を満たす形式に整形する
  // - summary: ホームチーム名 vs アウェイチーム名
  // - start: 試合日の日付とK/O時刻
  // - end: 試合日の日付とK/O時刻 + 2時間30分
  public execute(args: HTMLElement): GoogleCalendarEvent[] {
    const events: GoogleCalendarEvent[] = [];
    const trs = args.querySelectorAll("table.search-table tbody tr");
    for (const tr of trs) {
      const tds = tr.querySelectorAll("td");
      console.log(tds.length);
      const homeTeam = tds[5].querySelector("a")?.text;
      const awayTeam = tds[7].querySelector("a")?.text;
      const matchDate = tds[3].text;
      console.log(matchDate);
      const matchTime = tds[4].text;
      console.log(matchTime);
      // スタジアム名
      const stadium = tds[8].text;
      console.log(stadium);
      const startDateTime = new Date(
        `${matchDate.split("(")[0].trim()} ${matchTime}`
      );
      const endDateTime = new Date(
        startDateTime.getTime() + 2.5 * 60 * 60 * 1000
      );
      events.push({
        summary: `${homeTeam} vs ${awayTeam}`,
        start: {
          dateTime: startDateTime.toISOString(),
        },
        end: {
          dateTime: endDateTime.toISOString(),
        },
      });
    }
    return events;
  }
}
