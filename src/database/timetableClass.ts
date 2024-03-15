import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class TimetableClass extends Model<
    InferAttributes<TimetableClass>,
    InferCreationAttributes<TimetableClass>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare timetableClassId: CreationOptional<number>;
}

TimetableClass.init(
    {
        timetableClassId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "TimetableClass",
    }
);

await TimetableClass.sync();

export default TimetableClass;
