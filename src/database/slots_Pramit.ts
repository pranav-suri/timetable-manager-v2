import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "./sequelize";

class Slots extends Model<InferAttributes<Slots>, InferCreationAttributes<Slots>> {
  public declare createdAt: CreationOptional<Date>;
  public declare updatedAt: CreationOptional<Date>;
  public declare id: CreationOptional<number>;
  public declare day: string;
  public declare start: string;
  public declare end: string;
}

Slots.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    end: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "slots",
  }
);

await Slots.sync();

export default Slots;
