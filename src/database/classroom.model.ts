import { Sequelize, DataTypes, Model } from "sequelize";

export class Classroom extends Model {}

export function initClassroomModel(sequelize: Sequelize): void {
    Classroom.init(
        {
            classroom_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            is_lab: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        { sequelize, modelName: "classroom" }
    );
}
