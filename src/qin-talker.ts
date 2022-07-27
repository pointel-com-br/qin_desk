import axios, { AxiosResponse } from "axios";
import { QinChief } from "./qin-chief";
import { QinTalkerCmd } from "./qin-talker-cmd";
import { QinTalkerIssued } from "./qin-talker-issued";

export class QinTalker {
  private readonly _chief: QinChief;
  private readonly _cmd: QinTalkerCmd;
  private readonly _issued: QinTalkerIssued;

  public constructor(chief: QinChief) {
    this._chief = chief;
    this._cmd = new QinTalkerCmd(this);
    this._issued = new QinTalkerIssued(this);
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

  public get issued() {
    return this._issued;
  }
}
