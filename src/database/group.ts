import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Group extends Model<
    InferAttributes<Group>,
    InferCreationAttributes<Group>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare groupName: string;
    public declare AcademicYearId: ForeignKey<number>;
    public declare allowSimultaneous: boolean;
}

Group.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        groupName: {
            type: DataTypes.STRING,
        },
        allowSimultaneous: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Group",
    }
);

export default Group;
