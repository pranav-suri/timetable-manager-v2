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
import Teach from "./teach";

class Subject extends Model<
    InferAttributes<Subject>,
    InferCreationAttributes<Subject>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare subjectId: CreationOptional<number>;
    public declare subjectName: string;
    public declare isLab: boolean;
}

Subject.init(
    {
        subjectId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        subjectName: {
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
        tableName: "Subject",
    }
);

Subject.hasMany(Division);
Subject.hasMany(Group);
Subject.hasMany(Teach);

await Subject.sync();

export default Subject;
