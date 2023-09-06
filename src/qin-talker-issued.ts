import { QinTalker } from "./qin-talker";

export class QinTalkerIssued {
    private readonly _talker: QinTalker;

    public constructor(talker: QinTalker) {
        this._talker = talker;
    }

    public ask(question: IssuedQuestion): Promise<IssuedAnswer> {
        return new Promise<IssuedAnswer>((resolve, reject) => {
            this._talker
                .post("/issued", question)
                .then((res) => resolve(res.data as IssuedAnswer))
                .catch((err) => reject(err));
        });
    }

    public askWhenDone(question: IssuedQuestion): Promise<IssuedAnswer> {
        return new Promise<IssuedAnswer>((resolve, reject) => {
            const questionIsDone = {
                token: question.token,
                askIsDone: true,
            } as IssuedQuestion;
            const askIsDone = () => {
                this.ask(questionIsDone)
                    .then((res) => {
                        if (res.isDone) {
                            this.ask(question)
                                .then((res) => resolve(res))
                                .catch((err) => reject(err));
                        } else {
                            setTimeout((_) => askIsDone(), 700);
                        }
                    })
                    .catch((err) => reject(err));
            };
            askIsDone();
        });
    }

    public askConstantly(question: IssuedQuestion, process: AskConstantly) {
        const ask = () => {
            this.ask(question)
                .then((res) => {
                    if (process.onReceive) {
                        process.onReceive(res);
                    }
                    if (!process.stop) {
                        setTimeout((_) => ask(), 700);
                    }
                })
                .catch((err) => {
                    if (process.onError) {
                        process.onError(err);
                    }
                    if (!process.stop) {
                        setTimeout((_) => ask(), 700);
                    }
                });
        };
        ask();
    }

    public readStreamOut(reader: AskStream) {
        this.readStream(StreamKind.OUT, reader);
    }

    public readStreamErr(reader: AskStream) {
        this.readStream(StreamKind.ERR, reader);
    }

    public readStream(kind: StreamKind, reader: AskStream) {
        let from = 0;
        const ask = () => {
            let question: IssuedQuestion = null;
            if (kind === StreamKind.ERR) {
                question = {
                    token: reader.token,
                    askIsDone: true,
                    askErrLinesFrom: from,
                    askErrLinesUntil: from + reader.chunks,
                    askErrLinesSize: true,
                };
            } else if (kind === StreamKind.OUT) {
                question = {
                    token: reader.token,
                    askIsDone: true,
                    askOutLinesFrom: from,
                    askOutLinesUntil: from + reader.chunks,
                    askOutLinesSize: true,
                };
            }
            this.ask(question)
                .then((res) => {
                    let finished = false;
                    let got = 0;
                    if (res.outLinesFrom) {
                        if (reader.onReceive) {
                            res.outLinesFrom.forEach((line) => {
                                reader.onReceive(line);
                            });
                        }
                        got = res.outLinesFrom.length;
                    }
                    from = from + got;
                    console.log(res.isDone, from, res.outLinesSize);
                    if (res.isDone && from >= res.outLinesSize) {
                        finished = true;
                        if (reader.onFinish) {
                            reader.onFinish(res.outLinesSize);
                        }
                    }
                    if (!finished) {
                        setTimeout((_) => ask(), 70);
                    }
                })
                .catch((err) => {
                    if (reader.onError) {
                        reader.onError(err);
                    }
                });
        };
        ask();
    }
}

export type IssuedToken = string;

export type IssuedQuestion = {
    token: string;
    askCreatedAt?: boolean;
    askOutLines?: boolean;
    askOutLinesFrom?: number;
    askOutLinesUntil?: number;
    askOutLinesSize?: boolean;
    askErrLines?: boolean;
    askErrLinesFrom?: number;
    askErrLinesUntil?: number;
    askErrLinesSize?: boolean;
    askResultCode?: boolean;
    askIsDone?: boolean;
    askHasOut?: boolean;
    askHasErr?: boolean;
    askFinishedAt?: boolean;
};

export type IssuedAnswer = {
    createdAt?: number;
    outLines?: string;
    outLinesFrom?: string[];
    outLinesSize?: number;
    errLines?: string;
    errLinesFrom?: string[];
    errLinesSize?: number;
    resultCode?: number;
    isDone?: boolean;
    hasOut?: boolean;
    hasErr?: boolean;
    finishedAt?: number;
};

export type AskConstantly = {
    stop?: boolean;
    onReceive?: (received: IssuedAnswer) => void;
    onError?: (err: any) => void;
};

export type AskStream = {
    token: IssuedToken;
    chunks: number;
    onReceive?: (line: string) => void;
    onFinish?: (size: number) => void;
    onError?: (err: any) => void;
};

export enum StreamKind {
    OUT = "out",
    ERR = "err",
}
