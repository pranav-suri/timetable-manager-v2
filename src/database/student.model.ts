import { Sequelize, DataTypes, Model } from "sequelize";
import { Subdivision } from "./subdivision.model.ts";
import { Elective } from "./elective.model.ts";

export class Student extends Model {}

export function initStudentModel(sequelize: Sequelize): void {
    Student.init(
        {
            student_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            subdivision_id: DataTypes.INTEGER,
        },
        { sequelize, modelName: "student" }
    );

    Student.belongsTo(Subdivision, { foreignKey: "subdivision_id" });
    Student.hasMany(Elective, { foreignKey: "student_id" });
}
