import { Auth, calendar_v3 } from "googleapis";

export class GoogleCalendarEventDeletor {
  private client: calendar_v3.Calendar;
  constructor(auth: Auth.OAuth2Client) {
    this.client = new calendar_v3.Calendar({ auth });
  }

  /**
   * イベントを一括削除する
   * @param keyword イベントのタイトルに含まれるキーワード
   * @param timeMin 削除対象のイベントの開始日時
   * @returns
   * @example
   * ```typescript
   * const deletor = new GoogleCalendarEventDeletor(auth);
   * await deletor.bulkDelete({keyword: "川崎Ｆ", timeMin: new Date("2025-02-01").toISOString()});
   * ```
   */
  async bulkDelete({
    keyword,
    timeMin,
  }: {
    keyword: string;
    timeMin: string;
  }): Promise<void> {
    const list = await this.client.events.list({
      calendarId: "primary",
      timeMin,
      q: keyword,
    });
    // ids を整形
    const ids = (list.data.items ?? [])
      .map((item) => item.id)
      .filter((id) => id !== undefined && typeof id === "string");
    // 一括削除
    // 1 秒で 5 リクエストまでしか送れないので、それを考慮している
    for (let i = 0; i < ids.length; i += 5) {
      const slicedIds = ids.slice(i, i + 5);
      await Promise.all(
        slicedIds.map((id) =>
          this.client.events.delete({ calendarId: "primary", eventId: id })
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    console.log("削除完了");
  }
}
