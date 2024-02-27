import { Sequelize, DataTypes, Model } from "sequelize";
import { Timetable } from "./timetable.model";
import { Teacher } from "./teacher.model.ts";
import { SlotSubject } from "./slotSubject.model.ts";
import { SlotClassroom } from "./slotClassroom.model.ts";

export class Slot extends Model {}

export function initSlotModel(sequelize: Sequelize): void {
    Slot.init(
        {
            slot_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            timetable_id: DataTypes.INTEGER,
            teacher_id: DataTypes.INTEGER,
        },
        { sequelize, modelName: "slot" }
    );

    Slot.belongsTo(Timetable, { foreignKey: "timetable_id" });
    Slot.belongsTo(Teacher, { foreignKey: "teacher_id" });
    Slot.hasOne(SlotSubject, { foreignKey: "slot_id" });
    Slot.hasOne(SlotClassroom, { foreignKey: "slot_id" });
}
