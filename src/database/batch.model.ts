import { Sequelize, DataTypes, Model } from "sequelize";
import { Department } from "./department.model.ts";

export class Batch extends Model {}

export function initBatchModel(sequelize: Sequelize): void {
    Batch.init(
        {
            batch_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            batch_name: DataTypes.STRING,
            is_odd: DataTypes.BOOLEAN,
            year: DataTypes.INTEGER,
        },
        { sequelize, modelName: "batch" }
    );

    Batch.hasMany(Department, { foreignKey: "batch_id" });
    Department.belongsTo(Batch, { foreignKey: "batch_id" });
}
