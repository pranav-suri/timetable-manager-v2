import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class SlotDataClass extends Model<
    InferAttributes<SlotDataClass>,
    InferCreationAttributes<SlotDataClass>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare SlotDataId: ForeignKey<number>;
    public declare ClassroomId: ForeignKey<number>;
}

SlotDataClass.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "SlotDataClass",
    }
);

export default SlotDataClass;
