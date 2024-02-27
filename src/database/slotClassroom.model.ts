import { Sequelize, DataTypes, Model } from "sequelize";
import { Slot } from "./slot.model.ts";
import { Classroom } from "./classroom.model.ts";

export class SlotClassroom extends Model {}

export function initSlotClassroomModel(sequelize: Sequelize): void {
    SlotClassroom.init(
        {
            slot_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            classroom_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
        },
        { sequelize, modelName: "slot_classroom" }
    );

    SlotClassroom.belongsTo(Slot, { foreignKey: "slot_id" });
    SlotClassroom.belongsTo(Classroom, { foreignKey: "classroom_id" });
}
