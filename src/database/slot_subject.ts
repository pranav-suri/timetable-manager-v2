import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import SlotClassroom from "./slot_classroom";

class SlotSubject extends Model<InferAttributes<SlotSubject>, InferCreationAttributes<SlotSubject>> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
}

SlotSubject.init(
    {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "SlotSubject",
    }
);

SlotSubject.hasMany(SlotClassroom);
await SlotSubject.sync();

export default SlotSubject;
