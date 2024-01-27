import { Sequelize } from "sequelize";

const sequelize = new Sequelize("timetable_manager", "root", "", {
  dialect: "mysql",
  port: 3306,
});

export default sequelize;
