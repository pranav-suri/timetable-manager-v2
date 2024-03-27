import { Sequelize } from "sequelize";

const sequelize = new Sequelize("timetable_manager", "root", Bun.env.DB_PASS, {
    dialect: "mysql",
    logging: false,
    port: 3306,
});

export default sequelize;
