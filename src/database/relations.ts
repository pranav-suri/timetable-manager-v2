import AcademicYear from "./academic_year";
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

AcademicYear.hasMany(Batch);
Batch.belongsTo(AcademicYear);

Batch.hasMany(Department);
Department.belongsTo(Batch);

Department.hasMany(Division);
Division.belongsTo(Department);

Department.hasMany(Subject);
Subject.belongsTo(Department);

Division.hasMany(Subdivision);
Subdivision.belongsTo(Division);

AcademicYear.hasMany(Slot);
Slot.belongsTo(Slot);

AcademicYear.hasMany(Group);
Group.belongsTo(AcademicYear);


Group.hasMany(Subject);
Subject.belongsTo(Group);

AcademicYear.hasMany(Teacher);
Teacher.belongsTo(AcademicYear);


Subdivision.belongsToMany(Slot, { through: Timetable });
Slot.belongsToMany(Subdivision, { through: Slot });
Teach.hasOne(Timetable);
Timetable.belongsTo(Teach);

Timetable.hasMany(TimetableClass);
TimetableClass.belongsTo(Timetable);

Classroom.belongsToMany(Timetable, { through: TimetableClass });
Timetable.belongsToMany(Classroom, { through: TimetableClass });

// N-N relationships

Teacher.belongsToMany(Slot, { through: TeacherUnavailable });
Slot.belongsToMany(Teacher, { through: TeacherUnavailable });

Teacher.belongsToMany(Subject, { through: Teach });
Subject.belongsToMany(Teacher, { through: Teach });

await AcademicYear.sync();
await Batch.sync();
await Classroom.sync();
await Department.sync();
await Division.sync();
await Group.sync();
await Slot.sync();
await Subdivision.sync();
await Subject.sync();
await Teach.sync();
await Teacher.sync();
await TeacherUnavailable.sync();
await Timetable.sync();
await TimetableClass.sync();