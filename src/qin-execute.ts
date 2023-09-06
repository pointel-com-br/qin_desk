export type QinExecute = {
    exec: string;
    args?: string[];
    input?: string[];
    joinErrs?: boolean;
    logLevel?: QinLogLevel;
};

export enum QinLogLevel {
    LEVEL_ERROR = 0,
    LEVEL_WARN = 1,
    LEVEL_INFO = 2,
    LEVEL_DEBUG = 3,
    LEVEL_TRACE = 4,
}
