import superagent from "superagent";

export class Crawler {
  private url: string;
  constructor(url: string) {
    this.url = url;
  }

  public async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }
}
