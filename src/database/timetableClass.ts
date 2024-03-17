import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class TimetableClass extends Model<
    InferAttributes<TimetableClass>,
    InferCreationAttributes<TimetableClass>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare TimetableId: ForeignKey<number>;
    public declare ClassroomId: ForeignKey<number>;

}

TimetableClass.init(
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
        tableName: "TimetableClass",
    }
);


export default TimetableClass;
