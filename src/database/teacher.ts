import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import Slot from "./slot";

class Teacher extends Model<
    InferAttributes<Teacher>,
    InferCreationAttributes<Teacher>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare teacherId: CreationOptional<number>;
}

Teacher.init(
    {
        teacherId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Teacher",
    }
);
Teacher.hasMany(Slot);
await Teacher.sync();

export default Teacher;
