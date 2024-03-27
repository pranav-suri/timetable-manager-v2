export enum LogLevel {
    INFO = "INFO",
    ERROR = "ERROR",
    WARN = "WARN",
    DEBUG = "DEBUG",
}

export default class Logger {
    private static _getFilePath = (logLevel: LogLevel) => {
        const basePath = "/var/log/timetable-manager/";
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const fileName = `${year}-${month}-${day}-${logLevel}.log`;
        return basePath + fileName;
    };
    static async log(message: string, logLevel: LogLevel) {
        switch (logLevel) {
            case LogLevel.INFO: {
                if (Bun.env.NODE_ENV === "production") break;
                console.log(message);
                const infoFile = Bun.file(Logger._getFilePath(logLevel));
                const infoFileWriter = infoFile.writer();
                infoFileWriter.write(message);
                break;
            }
            case LogLevel.DEBUG: {
                if (Bun.env.NODE_ENV === "production") break;
                console.debug(message);
                const debugFile = Bun.file(Logger._getFilePath(logLevel));
                const debugFileWriter = debugFile.writer();
                debugFileWriter.write(message);
                break;
            }
            case LogLevel.ERROR: {
                console.error(message);
                const errorFile = Bun.file(Logger._getFilePath(logLevel));
                const errorFileWriter = errorFile.writer();
                errorFileWriter.write(message);
                break;
            }
            case LogLevel.WARN: {
                console.warn(message);
                const warnFile = Bun.file(Logger._getFilePath(logLevel));
                const warnFileWriter = warnFile.writer();
                warnFileWriter.write(message);
                break;
            }
        }
    }
}
