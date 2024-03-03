import { GoogleCalendarEvent } from "./interfaces/googleCalenderConverter";
import { Auth, calendar_v3 } from "googleapis";

export class GoogleCalendarEventCreator {
  private client: calendar_v3.Calendar;
  constructor(auth: Auth.OAuth2Client) {
    this.client = new calendar_v3.Calendar({ auth });
  }
  public async bulkInsert(events: GoogleCalendarEvent[]): Promise<void> {
    // 1秒に5回までしかリクエストを送れないので、5並列でリクエストを送って1.5秒待つ
    const promises = events.map((event) =>
      this.client.events.insert({ calendarId: "primary", requestBody: event })
    );
    for (let i = 0; i < promises.length; i += 5) {
      await Promise.all(promises.slice(i, i + 5));
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}
