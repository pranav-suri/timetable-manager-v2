import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class SlotClassroom extends Model<
    InferAttributes<SlotClassroom>,
    InferCreationAttributes<SlotClassroom>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
}

SlotClassroom.init(
    {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "SlotClassroom",
    }
);

await SlotClassroom.sync();

export default SlotClassroom;
