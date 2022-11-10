import { QinBody } from "qin_soul";
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
        .then((res) => {
          const lines = QinBody.getTextLines(res.data);
          let answer: IssuedAnswer = {};
          let i = 0;
          let gettingResultLines = false;
          while (i < lines.length) {
            if (!gettingResultLines) {
              switch (lines[i].trim()) {
                case "Created At:":
                  i++;
                  answer.createdAt = +lines[i].trim();
                  break;
                case "Result Coded:":
                  i++;
                  answer.resultCoded = +lines[i].trim();
                  break;
                case "Is Done:":
                  i++;
                  answer.isDone = lines[i].trim() === "true";
                  break;
                case "Finished At:":
                  i++;
                  answer.finishedAt = +lines[i].trim();
                  break;
                case "Result Lines:":
                  answer.resultLines = [];
                  gettingResultLines = true;
                  break;
                default:
                  break;
              }
            } else {
              answer.resultLines.push(lines[i]);
            }
            i++;
          }
          resolve(answer);
        })
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
  askResultLines?: boolean;
  askResultLinesFrom?: number;
  askResultCoded?: boolean;
  askIsDone?: boolean;
  askFinishedAt?: boolean;
};

export type IssuedAnswer = {
  createdAt?: number;
  resultLines?: string[];
  resultCoded?: number;
  isDone?: boolean;
  finishedAt?: number;
};
