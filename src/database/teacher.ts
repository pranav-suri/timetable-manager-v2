import sequelize from "./sequelize";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

class Teachers extends Model<InferAttributes<Teachers>, InferCreationAttributes<Teachers>> {
  public declare createdAt: CreationOptional<Date>;
  public declare updatedAt: CreationOptional<Date>;
  public get id(): CreationOptional<number> {
    return this.getDataValue("id");
  }
  public get name() {
    return this.getDataValue("name");
  }
  public set name(value: string) {
    this.update("name", value);
  }
  public get email() {
    return this.getDataValue("email");
  }
  public set email(value: string) {
    this.update("email", value);
  }
  public get password() {
    return this.getDataValue("password");
  }
  public set password(value: string) {
    this.update("password", value);
  }
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
