import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class SlotData extends Model<
    InferAttributes<SlotData>,
    InferCreationAttributes<SlotData>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare TeacherId: ForeignKey<number>;
    public declare SubjectId: ForeignKey<number>;
    public declare SubdivisionId: ForeignKey<number>;
    public declare SlotId: ForeignKey<number>;
}

SlotData.init(
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
        tableName: "SlotData",
    }
);

export default SlotData;
