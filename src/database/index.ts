import sequelize from "./sequelize";
import { AcademicYear, initAcademicYearModel } from "./academicYear.model";
import { Batch, initBatchModel } from "./batch.model";
import { Department, initDepartmentModel } from "./department.model";
import { Division, initDivisionModel } from "./division.model";
import { Subdivision, initSubdivisionModel } from "./subdivision.model";
import { Student, initStudentModel } from "./student.model";
import { Timetable, initTimetableModel } from "./timetable.model";
import { Slot, initSlotModel } from "./slot.model";
import { Teacher, initTeacherModel } from "./teacher.model";
import { Classroom, initClassroomModel } from "./classroom.model";
import { Subject, initSubjectModel } from "./subject.model";
import { Teach, initTeachModel } from "./teach.model";
import { Elective, initElectiveModel } from "./elective.model";
import { SlotSubject, initSlotSubjectModel } from "./slotSubject.model";
import { SlotClassroom, initSlotClassroomModel } from "./slotClassroom.model";

// Initialize models
initAcademicYearModel(sequelize);
initBatchModel(sequelize);
initDepartmentModel(sequelize);
initDivisionModel(sequelize);
initSubdivisionModel(sequelize);
initStudentModel(sequelize);
initTimetableModel(sequelize);
initSlotModel(sequelize);
initTeacherModel(sequelize);
initClassroomModel(sequelize);
initSubjectModel(sequelize);
initTeachModel(sequelize);
initElectiveModel(sequelize);
initSlotSubjectModel(sequelize);
initSlotClassroomModel(sequelize);

// Define associations
// Add your associations here
Batch.hasMany(Department, { foreignKey: "batch_id" });
Department.belongsTo(Batch, { foreignKey: "batch_id" });

Department.hasMany(Division, { foreignKey: "department_id" });
Division.belongsTo(Department, { foreignKey: "department_id" });

Division.hasMany(Subdivision, { foreignKey: "division_id" });
Subdivision.belongsTo(Division, { foreignKey: "division_id" });

Subdivision.hasMany(Student, { foreignKey: "subdivision_id" });
Student.belongsTo(Subdivision, { foreignKey: "subdivision_id" });

Subdivision.hasOne(Timetable, { foreignKey: "subdivision_id" });
Timetable.belongsTo(Subdivision, { foreignKey: "subdivision_id" });

Timetable.hasMany(Slot, { foreignKey: "timetable_id" });
Slot.belongsTo(Timetable, { foreignKey: "timetable_id" });

Teacher.hasMany(Slot, { foreignKey: "teacher_id" });
Slot.belongsTo(Teacher, { foreignKey: "teacher_id" });

Slot.hasOne(SlotSubject, { foreignKey: "slot_id" });
SlotSubject.belongsTo(Slot, { foreignKey: "slot_id" });

Slot.hasOne(SlotClassroom, { foreignKey: "slot_id" });
SlotClassroom.belongsTo(Slot, { foreignKey: "slot_id" });

Subject.hasMany(SlotSubject, { foreignKey: "subject_id" });
SlotSubject.belongsTo(Subject, { foreignKey: "subject_id" });

Subject.hasMany(Teach, { foreignKey: "subject_id" });
Teach.belongsTo(Subject, { foreignKey: "subject_id" });

Teacher.hasMany(Teach, { foreignKey: "teacher_id" });
Teach.belongsTo(Teacher, { foreignKey: "teacher_id" });

Student.hasMany(Elective, { foreignKey: "student_id" });
Elective.belongsTo(Student, { foreignKey: "student_id" });

Subject.hasMany(Elective, { foreignKey: "subject_id" });
Elective.belongsTo(Subject, { foreignKey: "subject_id" });

// Sync all models with the database
(async () => {
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
})();
