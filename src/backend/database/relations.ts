import {
    AcademicYear,
    Batch,
    Classroom,
    Department,
    Division,
    Group,
    Slot,
    Subdivision,
    Subject,
    Teach,
    Teacher,
    TeacherUnavailable,
    SlotData,
    SlotDataClass,
} from ".";

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

AcademicYear.hasMany(Slot, { foreignKey: { allowNull: false } });
Slot.belongsTo(AcademicYear);

AcademicYear.hasMany(Group, { foreignKey: { allowNull: false } });
Group.belongsTo(AcademicYear);

Group.hasMany(Subject, { foreignKey: { allowNull: false } });
Subject.belongsTo(Group);

AcademicYear.hasMany(Teacher, { foreignKey: { allowNull: false } });
Teacher.belongsTo(AcademicYear);

Slot.hasMany(SlotData, { foreignKey: { allowNull: false } });
SlotData.belongsTo(Slot);

Subdivision.hasMany(SlotData, { foreignKey: { allowNull: true } });
SlotData.belongsTo(Subdivision);

Teacher.hasMany(SlotData, { foreignKey: { allowNull: true } });
SlotData.belongsTo(Teacher);

Subject.hasMany(SlotData, { foreignKey: { allowNull: true } });
SlotData.belongsTo(Subject);

SlotData.hasMany(SlotDataClass, {
    foreignKey: { name: "SlotDataId", allowNull: false },
    as: "SlotDataClass",
});
SlotDataClass.belongsTo(SlotData, {
    foreignKey: { name: "SlotDataId", allowNull: false },
});
Classroom.hasMany(SlotDataClass, {
    foreignKey: { name: "ClassroomId", allowNull: false },
});
SlotDataClass.belongsTo(Classroom, {
    foreignKey: { name: "ClassroomId", allowNull: false },
});

// Classroom.belongsToMany(SlotData, {
//     through: SlotDataClass,
//     foreignKey: {
//         name: "SlotDataId",
//         allowNull: false,
//     },
// });
// SlotData.belongsToMany(Classroom, {
//     through: SlotDataClass,
//     foreignKey: {
//         name: "ClassroomId",
//         allowNull: false,
//     },
// });

Teacher.belongsToMany(Slot, { through: TeacherUnavailable });
Slot.belongsToMany(Teacher, { through: TeacherUnavailable });
Slot.hasMany(TeacherUnavailable);
TeacherUnavailable.belongsTo(Slot);
Teacher.hasMany(TeacherUnavailable);
TeacherUnavailable.belongsTo(Teacher);

// Teacher.belongsToMany(Subject, { through: Teach });
// Subject.belongsToMany(Teacher, { through: Teach });
Teacher.hasMany(Teach, { foreignKey: { allowNull: false }, as: "Teach" });
Teach.belongsTo(Teacher);
Subject.hasMany(Teach, { foreignKey: { allowNull: false }, as: "Teach" });
Teach.belongsTo(Subject);

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
await SlotData.sync();
await SlotDataClass.sync();
