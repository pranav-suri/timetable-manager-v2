import Department from "./department";
import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class Batch extends Model<
    InferAttributes<Batch>,
    InferCreationAttributes<Batch>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare batchId: CreationOptional<number>;
    public declare batchName: string;
    public declare isOdd: boolean;
    public declare year: number;
}

Batch.init(
    {
        batchId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        batchName: {
            type: DataTypes.STRING,
        },
        isOdd: {
            type: DataTypes.BOOLEAN,
        },
        year: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "batch",
    }
);
Batch.hasMany(Department);
await Batch.sync();

export default Batch;
