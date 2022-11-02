import axios, { AxiosResponse } from "axios";
import { QinChief } from "./qin-chief";
import { QinTalkerCmd } from "./qin-talker-cmd";
import { QinTalkerGiz } from "./qin-talker-giz";
import { QinTalkerIssued } from "./qin-talker-issued";
import { QinTalkerParam } from "./qin-talker-param";

export class QinTalker {
  private readonly _chief: QinChief;
  private readonly _cmd: QinTalkerCmd;
  private readonly _giz: QinTalkerGiz;
  private readonly _issued: QinTalkerIssued;
  private readonly _param: QinTalkerParam;

  public constructor(chief: QinChief) {
    this._chief = chief;
    this._cmd = new QinTalkerCmd(this);
    this._giz = new QinTalkerGiz(this);
    this._issued = new QinTalkerIssued(this);
    this._param = new QinTalkerParam(this);
  }

  public get(address: string, headers?: any): Promise<AxiosResponse<never>> {
    let configs = this._chief.getAxiosConfig(headers);
    return axios.get(address, configs);
  }

  public post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>> {
    let configs = this._chief.getAxiosConfig(headers);
    if (!configs.headers["Content-Type"]) {
      if (typeof data === "string" || data instanceof String) {
        configs.headers["Content-Type"] = "text/plain";
      } else if (data instanceof FormData) {
        configs.headers["Content-Type"] = "multipart/form-data";
      } else {
        configs.headers["Content-Type"] = "application/json";
      }
    }
    return axios.post(address, data, configs);
  }

  public get cmd() {
    return this._cmd;
  }

  public get giz() {
    return this._giz;
  }

  public get issued() {
    return this._issued;
  }

  public get param() {
    return this._param;
  }
}
