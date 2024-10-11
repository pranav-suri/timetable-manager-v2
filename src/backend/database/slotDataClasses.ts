import { Classroom } from ".";
import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class SlotDataClasses extends Model<
    InferAttributes<SlotDataClasses>,
    InferCreationAttributes<SlotDataClasses>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare SlotDataId: ForeignKey<number>;
    public declare ClassroomId: ForeignKey<number>;
    public declare Classroom?: ForeignKey<Classroom>;
}

SlotDataClasses.init(
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
        tableName: "SlotDataClasses",
    },
);

export default SlotDataClasses;
