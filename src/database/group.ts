import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import Subject from "./subject";

class Group extends Model<
    InferAttributes<Group>,
    InferCreationAttributes<Group>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare groupId: CreationOptional<number>;
    public declare groupName: string;
}

Group.init(
    {
        groupId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        groupName: {
            type: DataTypes.STRING,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Group",
    }
);

Group.hasMany(Subject);
await Group.sync();

export default Group;
