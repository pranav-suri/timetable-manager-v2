import sequelize from "./sequelize";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

class AcademicYear extends Model<
    InferAttributes<AcademicYear>,
    InferCreationAttributes<AcademicYear>
> {
    public declare createdAt: CreationOptional<Date>;
    public declare updatedAt: CreationOptional<Date>;
    public declare year: number;
}

AcademicYear.init(
    {
        year: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "academic_year",
    }
);

await AcademicYear.sync();

export default AcademicYear;
