import { Sequelize, DataTypes, Model } from "sequelize";
import { Batch } from "./batch.model.ts";
import { Division } from "./division.model.ts";

export class Department extends Model {}

export function initDepartmentModel(sequelize: Sequelize): void {
    Department.init(
        {
            department_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            batch_id: DataTypes.INTEGER,
        },
        { sequelize, modelName: "department" }
    );

    Department.belongsTo(Batch, { foreignKey: "batch_id" });
    Department.hasMany(Division, { foreignKey: "department_id" });
}
