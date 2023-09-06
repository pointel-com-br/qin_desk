import { QinBody } from "qin_soul";
import { QinExecute } from "./qin-execute";
import { QinTalker } from "./qin-talker";
import { IssuedToken } from "./qin-talker-issued";

export class QinTalkerGiz {
    private readonly _talker: QinTalker;

    public constructor(talker: QinTalker) {
        this._talker = talker;
    }

    public list(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this._talker
                .get("/list/giz")
                .then((res) => resolve(QinBody.getTextLines(res.data)))
                .catch((err) => reject(err));
        });
    }

    public run(execution: QinExecute): Promise<IssuedToken> {
        return new Promise<string>((resolve, reject) => {
            this._talker
                .post("/giz/run", execution)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }
}
