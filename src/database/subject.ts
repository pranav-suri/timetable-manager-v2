import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Subject extends Model<
    InferAttributes<Subject>,
    InferCreationAttributes<Subject>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare subjectName: string;
    public declare isLab: boolean;
}

Subject.init(
    {
        id: {
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



export default Subject;
