import { Sequelize, DataTypes, Model } from "sequelize";
import { Slot } from "./slot.model";
import { Subject } from "./subject.model.ts";

export class SlotSubject extends Model {}

export function initSlotSubjectModel(sequelize: Sequelize): void {
    SlotSubject.init(
        {
            // Assuming composite primary key
            slot_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            subject_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
        },
        { sequelize, modelName: "slot_subject" }
    );

    SlotSubject.belongsTo(Slot, { foreignKey: "slot_id" });
    SlotSubject.belongsTo(Subject, { foreignKey: "subject_id" });
}
