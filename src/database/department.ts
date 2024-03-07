import Division from "./division";
import Group from "./group";
import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import Subject from "./subject";

class Department extends Model<
    InferAttributes<Department>,
    InferCreationAttributes<Department>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare departmentId: CreationOptional<number>;
}

Department.init(
    {
        departmentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "department",
    }
);

Department.hasMany(Division);
Department.hasMany(Group);
Department.hasMany(Subject);

await Department.sync();

export default Department;
