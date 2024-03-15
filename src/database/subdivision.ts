import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Subdivision extends Model<
    InferAttributes<Subdivision>,
    InferCreationAttributes<Subdivision>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare subDivisionId: CreationOptional<number>;
    public declare subDivisionName: String;
}

Subdivision.init(
    {
        subDivisionId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        subDivisionName: {
            type: DataTypes.STRING,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Subdivision",
    }
);

await Subdivision.sync();

export default Subdivision;
