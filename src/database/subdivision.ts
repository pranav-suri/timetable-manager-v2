import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import Student from "./student";
import Timetable from "./timetable";

class Subdivision extends Model<
    InferAttributes<Subdivision>,
    InferCreationAttributes<Subdivision>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare subDivisionId: CreationOptional<number>;
}

Subdivision.init(
    {
        subDivisionId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Subdivision",
    }
);

Subdivision.hasMany(Student);
Subdivision.hasMany(Timetable);


await Subdivision.sync();

export default Subdivision;
