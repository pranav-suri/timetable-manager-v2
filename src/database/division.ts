import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import Subdivision from "./subdivision";

class Division extends Model<
    InferAttributes<Division>,
    InferCreationAttributes<Division>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare divisionId: CreationOptional<number>;
}

Division.init(
    {
        divisionId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Division",
    }
);

Division.hasMany(Subdivision);

await Division.sync();

export default Division;
