import { GoogleCalendarEvent } from "../interfaces/googleCalenderConverter";
import { Auth, calendar_v3 } from "googleapis";

export class GoogleCalendarEventCreator {
  private client: calendar_v3.Calendar;
  constructor(auth: Auth.OAuth2Client) {
    this.client = new calendar_v3.Calendar({ auth });
  }
  public async bulkInsert(events: GoogleCalendarEvent[]): Promise<void> {
    for (const event of events) {
      // rate limit対策
      // 5 並列でリクエスト & 2秒sleep でも引っかかったので、 0.5 秒ずつ 1 リクエスト
      console.log("イベントを追加します", event);
      await this.client.events.insert({
        calendarId: "primary",
        requestBody: event,
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}
