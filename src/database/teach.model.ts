import { Sequelize, DataTypes, Model } from "sequelize";
import { Teacher } from "./teacher.model.ts";
import { Subject } from "./subject.model.ts";

export class Teach extends Model {}

export function initTeachModel(sequelize: Sequelize): void {
    Teach.init(
        {
            teacher_id: DataTypes.INTEGER,
            subject_id: DataTypes.INTEGER,
        },
        { sequelize, modelName: "teach" }
    );

    Teach.belongsTo(Teacher, { foreignKey: "teacher_id" });
    Teach.belongsTo(Subject, { foreignKey: "subject_id" });
}
