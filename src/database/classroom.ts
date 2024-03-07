import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Classroom extends Model<
    InferAttributes<Classroom>,
    InferCreationAttributes<Classroom>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare classroomId: CreationOptional<number>;
    public declare isLab: boolean;
}

Classroom.init(
    {
        classroomId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        isLab: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "classroom",
    }
);

await Classroom.sync();

export default Classroom;
