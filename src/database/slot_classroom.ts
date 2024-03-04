import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class slotClassrom extends Model<
    InferAttributes<slotClassrom>,
    InferCreationAttributes<slotClassrom>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    // public declare id: CreationOptional<number>;
    // public declare name: string;
    // public declare email: string;
    // public declare password: string;
}

slotClassrom.init(
    {
        
        // id: {
        //     type: DataTypes.INTEGER.UNSIGNED,
        //     autoIncrement: true,
        //     primaryKey: true,
        // },
        // name: {
        //     type: DataTypes.STRING,
        // },
        // email: {
        //     type: DataTypes.STRING,
        // },
        // password: {
        //     type: DataTypes.STRING,
        // },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "slotClassrom",
    }
);

await slotClassrom.sync();

export default slotClassrom;
