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

class Teach extends Model<
    InferAttributes<Teach>,
    InferCreationAttributes<Teach>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
}

Teach.init(
    {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },

    {
        sequelize,
        tableName: "Teach",
    }
);

await Teach.sync();

export default Teach;
