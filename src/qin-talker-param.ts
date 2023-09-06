import { QinTalker } from "./qin-talker";

export class QinTalkerParam {
    private readonly _talker: QinTalker;

    public constructor(talker: QinTalker) {
        this._talker = talker;
    }

    public get(name: string, orDefault: string = ""): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this._talker
                .get("/param/" + encodeURIComponent(name))
                .then((res) => {
                    resolve(res.data ? res.data : orDefault);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}
