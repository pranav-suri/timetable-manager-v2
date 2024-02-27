import { Sequelize, DataTypes, Model } from "sequelize";
import { Student } from "./student.model.ts";
import { Subject } from "./subject.model.ts";

export class Elective extends Model {}

export function initElectiveModel(sequelize: Sequelize): void {
    Elective.init(
        {
            student_id: DataTypes.INTEGER,
            subject_id: DataTypes.INTEGER,
        },
        { sequelize, modelName: "elective" }
    );

    Elective.belongsTo(Student, { foreignKey: "student_id" });
    Elective.belongsTo(Subject, { foreignKey: "subject_id" });
}
