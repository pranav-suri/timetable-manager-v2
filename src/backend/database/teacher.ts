import { SlotDatas } from ".";
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

class Teacher extends Model<InferAttributes<Teacher>, InferCreationAttributes<Teacher>> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare teacherName: string;
    public declare teacherEmail: string;
    public declare AcademicYearId: ForeignKey<number>;
    public declare SlotDatas: ForeignKey<SlotDatas[]>;
}

Teacher.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        teacherName: {
            type: DataTypes.STRING,
        },
        teacherEmail: {
            type: DataTypes.STRING,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Teacher",
    },
);

export default Teacher;
