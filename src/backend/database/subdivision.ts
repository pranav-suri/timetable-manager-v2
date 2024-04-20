import { Division, SlotDataSubdivisions } from ".";
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

class Subdivision extends Model<
    InferAttributes<Subdivision>,
    InferCreationAttributes<Subdivision>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare subdivisionName: string;
    public declare DivisionId: ForeignKey<number>;
    public declare SlotDataSubdivisions?: ForeignKey<SlotDataSubdivisions[]>;
    public declare Division?: ForeignKey<Division>;
}

Subdivision.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        subdivisionName: {
            type: DataTypes.STRING,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Subdivision",
    },
);

export default Subdivision;
