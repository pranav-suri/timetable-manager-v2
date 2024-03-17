import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
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
    public declare id: CreationOptional<number>;
    public declare TeacherId: ForeignKey<number>;
    public declare SubjectId: ForeignKey<number>;
    public declare SubdivionId: ForeignKey<number>;
    public declare SlotId: ForeignKey<number>;
}

Timetable.init(
    {
        id: {
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



export default Timetable;
