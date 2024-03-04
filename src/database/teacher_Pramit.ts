import sequelize from "./sequelize";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

class Teachers extends Model<InferAttributes<Teachers>, InferCreationAttributes<Teachers>> {
  public declare createdAt: CreationOptional<Date>;
  public declare updatedAt: CreationOptional<Date>;
  public declare id: CreationOptional<number>;
  public declare name: string;
  public declare email: string;
  public declare password: string;
}

Teachers.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "teachers",
  }
);

await Teachers.sync();

export default Teachers;
