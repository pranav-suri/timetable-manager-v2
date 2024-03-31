export enum LogLevel {
    INFO = "INFO",
    ERROR = "ERROR",
    WARN = "WARN",
    DEBUG = "DEBUG",
}

/**
 * Logger class for logging messages to the console and log files.
 */
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

    /**
     * Function to log messages to the console and to a log file at `/var/log/timetable-manager/`
     * @param message - The message to be logged.
     * @param logLevel - The log level of the message.
     * @param logToConsole - Whether to log the message to the console. Default is false.
     */
    static async log(message: string, logLevel: LogLevel, logToConsole: boolean = false) {
        switch (logLevel) {
            case LogLevel.INFO: {
                if (Bun.env.NODE_ENV === "production") break;
                if (logToConsole) console.log(message);
                const infoFile = Bun.file(Logger._getFilePath(logLevel));
                const infoFileWriter = infoFile.writer();
                infoFileWriter.write(message);
                break;
            }
            case LogLevel.DEBUG: {
                if (Bun.env.NODE_ENV === "production") break;
                if (logToConsole) console.debug(message);
                const debugFile = Bun.file(Logger._getFilePath(logLevel));
                const debugFileWriter = debugFile.writer();
                debugFileWriter.write(message);
                break;
            }
            case LogLevel.ERROR: {
                if (logToConsole) console.error(message);
                const errorFile = Bun.file(Logger._getFilePath(logLevel));
                const errorFileWriter = errorFile.writer();
                errorFileWriter.write(message);
                break;
            }
            case LogLevel.WARN: {
                if (logToConsole) console.warn(message);
                const warnFile = Bun.file(Logger._getFilePath(logLevel));
                const warnFileWriter = warnFile.writer();
                warnFileWriter.write(message);
                break;
            }
        }
    }
}
