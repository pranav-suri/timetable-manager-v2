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
    public declare teacherUnavailableId: CreationOptional<number>;
}

TeacherUnavailable.init(
    {
        teacherUnavailableId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "TeacherUnavailable",
    }
);


export default TeacherUnavailable;
