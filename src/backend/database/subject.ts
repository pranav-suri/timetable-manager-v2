import Group from "./group";
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

class Subject extends Model<InferAttributes<Subject>, InferCreationAttributes<Subject>> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare subjectName: string;
    public declare isLab: boolean;
    public declare DepartmentId: ForeignKey<number>;
    public declare GroupId: ForeignKey<number>;
    public declare Group: ForeignKey<Group>;
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
    },
);

export default Subject;
