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
import SlotDatas from "./slotDatas";
import { Subdivision } from ".";

class SlotDataSubdivisions extends Model<
    InferAttributes<SlotDataSubdivisions>,
    InferCreationAttributes<SlotDataSubdivisions>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare id: CreationOptional<number>;
    public declare SlotDataId: ForeignKey<number>;
    public declare SubdivisionId: ForeignKey<number>;
    public declare SlotData: NonAttribute<SlotDatas>;
    public declare Subdivision: NonAttribute<Subdivision>;
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
