import { Sequelize, DataTypes, Model } from "sequelize";
import { Department } from "./department.model.ts";
import { Subdivision } from "./subdivision.model.ts";

export class Division extends Model {}

export function initDivisionModel(sequelize: Sequelize): void {
    Division.init(
        {
            division_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            department_id: DataTypes.INTEGER,
        },
        { sequelize, modelName: "division" }
    );

    Division.belongsTo(Department, { foreignKey: "department_id" });
    Division.hasMany(Subdivision, { foreignKey: "division_id" });
}
