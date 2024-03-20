import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Department extends Model<InferAttributes<Department>, InferCreationAttributes<Department>> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare departmentName: string;
    public declare BatchId: ForeignKey<number>;
}

Department.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        departmentName: {
            type: DataTypes.STRING,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        BatchId: DataTypes.INTEGER.UNSIGNED,
    },
    {
        sequelize,
        tableName: "Department",
    },
);

export default Department;
