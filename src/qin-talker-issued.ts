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
}

export type IssuedToken = string;

export type IssuedQuestion = {
  token: string;
  askCreatedAt?: boolean;
  askOutLines?: boolean;
  askOutLinesFrom?: number;
  askOutLinesSize?: boolean;
  askErrLines?: boolean;
  askErrLinesFrom?: number;
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
  outLinesFrom?: string;
  outLinesSize?: number;
  errLines?: string;
  errLinesFrom?: string;
  errLinesSize?: number;
  resultCode?: number;
  isDone?: boolean;
  hasOut?: boolean;
  hasErr?: boolean;
  finishedAt?: number;
};
