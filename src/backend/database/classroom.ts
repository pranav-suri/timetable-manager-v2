import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Classroom extends Model<InferAttributes<Classroom>, InferCreationAttributes<Classroom>> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare classroomName: string;
    public declare isLab: boolean;
    public declare AcademicYearId: ForeignKey<number>;
    public declare SlotDataClasses: ForeignKey<SlotDataClasses[]>;
}

Classroom.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        classroomName: {
            type: DataTypes.STRING,
        },
        isLab: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Classroom",
    },
);

export default Classroom;
