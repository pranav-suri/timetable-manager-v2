import Division from "./division";
import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class department extends Model<
    InferAttributes<department>,
    InferCreationAttributes<department>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare departmentId: CreationOptional<number>;
}

department.init(
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

department.hasMany(Division);

await department.sync();

export default department;
