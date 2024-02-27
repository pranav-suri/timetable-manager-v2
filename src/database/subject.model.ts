import { Sequelize, DataTypes, Model } from "sequelize";
import { Department } from "./department.model.ts";
import { Teach } from "./teach.model.ts";
import { Elective } from "./elective.model.ts";

export class Subject extends Model {}

export function initSubjectModel(sequelize: Sequelize): void {
    Subject.init(
        {
            subject_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            subject_name: DataTypes.STRING,
            is_lab: DataTypes.BOOLEAN,
            type: DataTypes.ENUM("core", "elective"),
            department_id: DataTypes.INTEGER,
        },
        { sequelize, modelName: "subject" }
    );

    Subject.belongsTo(Department, { foreignKey: "department_id" });
    Subject.hasMany(Teach, { foreignKey: "subject_id" });
    Subject.hasMany(Elective, { foreignKey: "subject_id" });
}
