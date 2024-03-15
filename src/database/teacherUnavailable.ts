import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class TeacherUnavailable extends Model<
    InferAttributes<TeacherUnavailable>,
    InferCreationAttributes<TeacherUnavailable>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare teacherId: CreationOptional<number>;
    public declare teacherName: string;
    public declare teacherEmail: string;
}

TeacherUnavailable.init(
    {
        teacherId: {
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
    }
);
await Teacher.sync();

export default Teacher;
