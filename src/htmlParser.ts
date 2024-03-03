import { parse } from "node-html-parser";

export class HtmlParser {
  private html: string;
  constructor(html: string) {
    this.html = html;
  }
  public parse() {
    const root = parse(this.html);
    return root;
  }
}
