import { SlotDatas } from ".";
import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Slot extends Model<InferAttributes<Slot>, InferCreationAttributes<Slot>> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare day: number;
    public declare number: number;
    public declare AcademicYearId: ForeignKey<number>;
    public declare SlotDatas?: ForeignKey<SlotDatas[]>;
}

Slot.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        day: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        number: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Slot",
    },
);

export default Slot;
