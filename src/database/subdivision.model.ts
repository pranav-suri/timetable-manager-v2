import { Sequelize, DataTypes, Model } from "sequelize";
import { Division } from "./division.model.ts";
import { Student } from "./student.model.ts";
import { Timetable } from "./timetable.model.ts";

export class Subdivision extends Model {}

export function initSubdivisionModel(sequelize: Sequelize): void {
    Subdivision.init(
        {
            subdivision_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            division_id: DataTypes.INTEGER,
        },
        { sequelize, modelName: "subdivision" }
    );

    Subdivision.belongsTo(Division, { foreignKey: "division_id" });
    Subdivision.hasMany(Student, { foreignKey: "subdivision_id" });
    Subdivision.hasOne(Timetable, { foreignKey: "subdivision_id" });
}
