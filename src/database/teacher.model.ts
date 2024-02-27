import { Sequelize, DataTypes, Model } from "sequelize";
import { Slot } from "./slot.model.ts";

export class Teacher extends Model {}

export function initTeacherModel(sequelize: Sequelize): void {
    Teacher.init(
        {
            teacher_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
        },
        { sequelize, modelName: "teacher" }
    );

    Teacher.hasMany(Slot, { foreignKey: "teacher_id" });
}
