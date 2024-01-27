import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "./sequelize";

class Slots extends Model<InferAttributes<Slots>, InferCreationAttributes<Slots>> {
  public declare createdAt: CreationOptional<Date>;
  public declare updatedAt: CreationOptional<Date>;
  public get id(): CreationOptional<number> {
    return this.getDataValue("id");
  }
  public get day(): string {
    return this.getDataValue("day");
  }
  public get start(): string {
    return this.getDataValue("start");
  }
  public get end(): string {
    return this.getDataValue("end");
  }
  public set day(value: string) {
    this.setDataValue("day", value);
    this.save();
  }
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
