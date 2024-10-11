import { Sequelize } from "sequelize";
import Logger from "../../utils/logging";

const sequelize = new Sequelize("timetable_manager", "root", Bun.env.DB_PASS, {
    dialect: "mysql",
    logging: Logger.sqlLog,
    port: 3306,
    dialectOptions: {
        socketPath: "/var/run/mysqld/mysqld.sock",
    },
});

export default sequelize;
