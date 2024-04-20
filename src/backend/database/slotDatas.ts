import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import Subject from "./subject";
import { SlotDataClasses, SlotDataSubdivisions, Teacher } from ".";

class SlotDatas extends Model<InferAttributes<SlotDatas>, InferCreationAttributes<SlotDatas>> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare TeacherId: ForeignKey<number | null>;
    public declare SubjectId: ForeignKey<number>;
    public declare SlotId: ForeignKey<number>;
    public declare Subject?: ForeignKey<Subject>;
    public declare Teacher?: ForeignKey<Teacher>;
    public declare SlotDataSubdivisions?: ForeignKey<SlotDataSubdivisions[]>;
    public declare SlotDataClasses?: ForeignKey<SlotDataClasses[]>;
}

SlotDatas.init(
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
        tableName: "SlotDatas",
    },
);

export default SlotDatas;
