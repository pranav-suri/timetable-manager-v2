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

Batch.hasMany(Department);

Department.hasMany(Division);

Division.hasMany(Subdivision);

AcademicYear.hasMany(Slot);

AcademicYear.hasMany(Group);

Department.hasMany(Subject);
Group.hasMany(Subject);

AcademicYear.hasMany(Teacher);

Teacher.hasMany(TeacherUnavailable); // has many or has one?
Slot.hasMany(TeacherUnavailable); // ^

Teacher.hasMany(Teach); // how is it linked?

Teacher.hasMany(Subject); // ^

Subdivision.hasMany(Timetable); // has one?
Teacher.hasMany(Timetable); //
Subject.hasMany(Timetable); //
Slot.hasMany(Timetable); //

Timetable.hasMany(TimetableClass);
Classroom.hasMany(TimetableClass);
