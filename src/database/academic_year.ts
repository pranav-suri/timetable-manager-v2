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
    public declare acadYearId: CreationOptional<number>;
    public declare year: number;
    public declare name: String;
}

AcademicYear.init(
    {
        acadYearId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        year: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        name: {
            type: DataTypes.STRING,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "academic_year",
    }
);



export default AcademicYear;
