import {
  GoogleCalendarEvent,
  GoogleCalenderConverter,
} from "./interfaces/googleCalenderConverter";
import { HTMLElement } from "node-html-parser";

export class HtmlToGoogleCalenderConverter
  implements GoogleCalenderConverter<{ html: HTMLElement; year: string }>
{
  public execute(args: {
    html: HTMLElement;
    year: string;
  }): GoogleCalendarEvent[] {
    const events: GoogleCalendarEvent[] = [];
    const trs = args.html.querySelectorAll("table.search-table tbody tr");
    for (const tr of trs) {
      const tds = tr.querySelectorAll("td");
      const homeTeam = tds[5].querySelector("a")?.text.trim();
      const awayTeam = tds[7].querySelector("a")?.text.trim();
      const matchDate = tds[3].text.trim();
      const matchTime = tds[4].text.trim();
      const startDateTime = new Date(
        `${args.year}-${matchDate.split("(")[0].replace("/", "-")}T${
          matchTime || "00:00"
        }:00+09:00`
      );
      const endDateTime = new Date(
        startDateTime.getTime() + 2.5 * 60 * 60 * 1000
      );
      // 11月の試合とかはまだ開催時刻が決まってない。matchTimeがない場合は、allDayEventとして扱うためにdateにYYYY-MM-DD形式で設定
      const startEndRequest: Pick<GoogleCalendarEvent, "start" | "end"> = {
        start: !!matchTime
          ? { dateTime: startDateTime.toISOString() }
          : {
              date: startDateTime
                .toLocaleDateString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })
                .replace(/\//g, "-"),
            },
        end: !!matchTime
          ? { dateTime: endDateTime.toISOString() }
          : {
              date: endDateTime
                .toLocaleDateString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })
                .replace(/\//g, "-"),
            },
      };
      events.push({
        summary: `${homeTeam} vs ${awayTeam}`,
        ...startEndRequest,
      });
    }
    return events;
  }
}
