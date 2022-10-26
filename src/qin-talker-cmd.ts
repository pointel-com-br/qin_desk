import { QinBody } from "qin_soul";
import { QinTalker } from "./qin-talker";
import { IssuedToken } from "./qin-talker-issued";

export class QinTalkerCmd {
  private readonly _talker: QinTalker;

  public constructor(talker: QinTalker) {
    this._talker = talker;
  }

  public list(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this._talker
        .get("/list/cmd")
        .then((res) => resolve(QinBody.getTextLines(res.data)))
        .catch((err) => reject(err));
    });
  }

  public run(start: CmdRunStart): Promise<IssuedToken> {
    return new Promise<string>((resolve, reject) => {
      this._talker
        .post("/cmd/run", start)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
}

export type CmdRunStart = {
  exec: string;
  args?: string[];
  input?: string[];
};
