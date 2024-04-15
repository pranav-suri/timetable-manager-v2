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
import Subject from "./subject";

class Teach extends Model<InferAttributes<Teach>, InferCreationAttributes<Teach>> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare TeacherId: ForeignKey<number>;
    public declare SubjectId: ForeignKey<number>;
    public declare Subject: ForeignKey<Subject>;
    public declare Teacher: ForeignKey<Teach>;
}

Teach.init(
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
        tableName: "Teach",
    },
);

export default Teach;
