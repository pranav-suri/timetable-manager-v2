import { Sequelize, DataTypes, Model } from "sequelize";
import { Subdivision } from "./subdivision.model.ts";
import { Slot } from "./slot.model.ts";

export class Timetable extends Model {}

export function initTimetableModel(sequelize: Sequelize): void {
    Timetable.init(
        {
            timetable_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            subdivision_id: DataTypes.INTEGER,
        },
        { sequelize, modelName: "timetable" }
    );

    Timetable.belongsTo(Subdivision, { foreignKey: "subdivision_id" });
    Timetable.hasMany(Slot, { foreignKey: "timetable_id" });
}
