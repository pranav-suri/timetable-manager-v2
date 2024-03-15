import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
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
    public declare groupId: CreationOptional<number>;
    public declare groupType: string;
}

Group.init(
    {
        groupId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        groupType: {
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

await Group.sync();

export default Group;
