import AcademicYear from "./academicYear";
import Batch from "./batch";
import Classroom from "./classroom";
import Department from "./department";
import Division from "./division";
import Group from "./group";
import Slot from "./slot";
import Subdivision from "./subdivision";
import Subject from "./subject";
import Teach from "./teach";
import Teacher from "./teacher";
import TeacherUnavailable from "./teacherUnavailable";
import Timetable from "./timetable";
import TimetableClass from "./timetableClass";

// Hoping to define all relationships in this file

AcademicYear.hasMany(Batch, { foreignKey: { allowNull: false } });
Batch.belongsTo(AcademicYear);

AcademicYear.hasMany(Classroom, { foreignKey: { allowNull: false } });
Classroom.belongsTo(AcademicYear);

Batch.hasMany(Department, { foreignKey: { allowNull: false } });
Department.belongsTo(Batch);

Department.hasMany(Division, { foreignKey: { allowNull: false } });
Division.belongsTo(Department);

Department.hasMany(Subject, { foreignKey: { allowNull: false } });
Subject.belongsTo(Department);

Division.hasMany(Subdivision, { foreignKey: { allowNull: false } });
Subdivision.belongsTo(Division);

AcademicYear.hasMany(Slot), { foreignKey: { allowNull: false } };
Slot.belongsTo(AcademicYear);

AcademicYear.hasMany(Group, { foreignKey: { allowNull: false } });
Group.belongsTo(AcademicYear);

Group.hasMany(Subject, { foreignKey: { allowNull: true } });
Subject.belongsTo(Group);

AcademicYear.hasMany(Teacher, { foreignKey: { allowNull: false } });
Teacher.belongsTo(AcademicYear);

Subdivision.belongsToMany(Slot, { through: Timetable });
Slot.belongsToMany(Subdivision, { through: Timetable });

Teach.hasOne(Timetable);
Timetable.belongsTo(Teach);

Classroom.belongsToMany(Timetable, { through: TimetableClass });
Timetable.belongsToMany(Classroom, { through: TimetableClass });

Teacher.belongsToMany(Slot, { through: TeacherUnavailable });
Slot.belongsToMany(Teacher, { through: TeacherUnavailable });

Teacher.belongsToMany(Subject, { through: Teach });
Subject.belongsToMany(Teacher, { through: Teach });

await AcademicYear.sync();
await Batch.sync();
await Group.sync();
await Teacher.sync();
await Classroom.sync();
await Slot.sync();

await Department.sync();
await Division.sync();
await Subdivision.sync();
await Subject.sync();

await Teach.sync();
await TeacherUnavailable.sync();
await Timetable.sync();
await TimetableClass.sync();
