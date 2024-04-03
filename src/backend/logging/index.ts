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
        const basePath = "./logs/";
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const fileName = `${year}-${month}-${day}-${logLevel}.log`;
        return basePath + fileName;
    };

    private static createFileIfNotExists = async (filePath: string) => {
        const file = Bun.file(filePath);
        if (!file.exists()) {
            await Bun.write(filePath, "");
        }
    };

    /**
     * Function to log messages to the console and to a log file at `./logs/`
     * @param message - The message to be logged.
     * @param logLevel - The log level of the message.
     * @param logToConsole - Whether to log the message to the console. Default is false.
     */
    static log = async (
        message: string,
        logLevel: LogLevel,
        logToConsole: boolean = false,
        path: string,
    ) => {
        const srcPath = path.split("/").slice(-4, path.length).join("/");
        const messagePrefix = `[${new Date().toISOString()}] : ${srcPath} => `;
        switch (logLevel) {
            case LogLevel.INFO: {
                if (Bun.env.NODE_ENV === "production") return;
                if (logToConsole) console.log(messagePrefix + message);
                break;
            }
            case LogLevel.DEBUG: {
                if (Bun.env.NODE_ENV === "production") return;
                if (logToConsole) console.debug(messagePrefix + message);
                break;
            }
            case LogLevel.ERROR: {
                if (logToConsole) console.error(messagePrefix + message);
                break;
            }
            case LogLevel.WARN: {
                if (logToConsole) console.warn(messagePrefix + message);
                break;
            }
        }
        await this.createFileIfNotExists(Logger._getFilePath(logLevel));
        await Bun.write(
            Logger._getFilePath(logLevel),
            messagePrefix + message + (await Bun.file(Logger._getFilePath(logLevel)).text()) + "\n",
        );
    };
}
