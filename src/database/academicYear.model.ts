import { Sequelize, DataTypes, Model } from "sequelize";

export class AcademicYear extends Model {}

export function initAcademicYearModel(sequelize: Sequelize): void {
    AcademicYear.init(
        {
            year: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
        },
        { sequelize, modelName: "academic_year" }
    );
}
