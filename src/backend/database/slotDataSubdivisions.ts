import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class SlotDataSubdivisions extends Model<
    InferAttributes<SlotDataSubdivisions>,
    InferCreationAttributes<SlotDataSubdivisions>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare SlotDataId: ForeignKey<number>;
    public declare SubdivisionId: ForeignKey<number>;
}

SlotDataSubdivisions.init(
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
        tableName: "SlotDataSubdivisions",
    }
);

export default SlotDataSubdivisions;
