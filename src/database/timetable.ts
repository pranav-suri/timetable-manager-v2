import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Timetable extends Model<
    InferAttributes<Timetable>,
    InferCreationAttributes<Timetable>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare timetableId: CreationOptional<number>;
}

Timetable.init(
    {
        timetableId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Timetable",
    }
);

await Timetable.sync();

export default Timetable;
