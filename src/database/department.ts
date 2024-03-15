import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Department extends Model<
    InferAttributes<Department>,
    InferCreationAttributes<Department>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare departmentId: CreationOptional<number>;
    public declare departmentName: string;
}

Department.init(
    {
        departmentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        departmentName: {
            type: DataTypes.STRING,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "department",
    }
);

await Department.sync();

export default Department;
