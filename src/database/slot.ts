import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import SlotSubject from "./slot_subject";

class Slot extends Model<
    InferAttributes<Slot>,
    InferCreationAttributes<Slot>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare slotId: CreationOptional<number>;
}

Slot.init(
    {
        slotId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Slot",
    }
);


Slot.hasMany(SlotSubject);
await Slot.sync();

export default Slot;
