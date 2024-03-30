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
    SlotDatas,
    SlotDataClasses,
    SlotDataSubdivisions,
} from ".";

AcademicYear.hasMany(Batch, { foreignKey: { allowNull: false }, as: "Batch" });
Batch.belongsTo(AcademicYear);

AcademicYear.hasMany(Classroom, { foreignKey: { allowNull: false }, as: "Classroom" });
Classroom.belongsTo(AcademicYear);

Batch.hasMany(Department, { foreignKey: { allowNull: false }, as: "Department" });
Department.belongsTo(Batch);

Department.hasMany(Division, { foreignKey: { allowNull: false }, as: "Division" });
Division.belongsTo(Department);

Department.hasMany(Subject, { foreignKey: { allowNull: false }, as: "Subject" });
Subject.belongsTo(Department);

Division.hasMany(Subdivision, { foreignKey: { allowNull: false }, as: "Subdivision" });
Subdivision.belongsTo(Division);

AcademicYear.hasMany(Slot, { foreignKey: { allowNull: false }, as: "Slot" });
Slot.belongsTo(AcademicYear);

AcademicYear.hasMany(Group, { foreignKey: { allowNull: false }, as: "Group" });
Group.belongsTo(AcademicYear);

Group.hasMany(Subject, { foreignKey: { allowNull: false }, as: "Subject" });
Subject.belongsTo(Group);

AcademicYear.hasMany(Teacher, { foreignKey: { allowNull: false }, as: "Teacher" });
Teacher.belongsTo(AcademicYear);

Slot.hasMany(SlotDatas, { foreignKey: { allowNull: false } });
SlotDatas.belongsTo(Slot);

Teacher.hasMany(SlotDatas, { foreignKey: { allowNull: true } });
SlotDatas.belongsTo(Teacher);

Subject.hasMany(SlotDatas, { foreignKey: { allowNull: true } });
SlotDatas.belongsTo(Subject);

SlotDatas.hasMany(SlotDataClasses, {
    foreignKey: { name: "SlotDataId", allowNull: false },
    as: "SlotDataClasses",
});
SlotDataClasses.belongsTo(SlotDatas, {
    foreignKey: { name: "SlotDataId", allowNull: false },
});
Classroom.hasMany(SlotDataClasses, {
    foreignKey: { name: "ClassroomId", allowNull: false },
});
SlotDataClasses.belongsTo(Classroom, {
    foreignKey: { name: "ClassroomId", allowNull: false },
});

SlotDatas.hasMany(SlotDataSubdivisions, {
    foreignKey: { name: "SlotDataId", allowNull: false },
    as: "SlotDataSubdivisions",
});
SlotDataSubdivisions.belongsTo(SlotDatas, {
    foreignKey: { name: "SlotDataId", allowNull: false },
});
Subdivision.hasMany(SlotDataSubdivisions, {
    foreignKey: { name: "SubdivisionId", allowNull: false },
    as: "SlotDataSubdivisions",
});
SlotDataSubdivisions.belongsTo(Subdivision, {
    foreignKey: { name: "SubdivisionId", allowNull: false },
});

Teacher.belongsToMany(Slot, { through: TeacherUnavailable });
Slot.belongsToMany(Teacher, { through: TeacherUnavailable });
Slot.hasMany(TeacherUnavailable);
TeacherUnavailable.belongsTo(Slot);
Teacher.hasMany(TeacherUnavailable);
TeacherUnavailable.belongsTo(Teacher);

Teacher.hasMany(Teach, { foreignKey: { allowNull: false }, as: "Teach" });
Teach.belongsTo(Teacher);
Subject.hasMany(Teach, { foreignKey: { allowNull: false }, as: "Teach" });
Teach.belongsTo(Subject);

// Teacher.belongsToMany(Subject, { through: Teach });
// Subject.belongsToMany(Teacher, { through: Teach });

// Classroom.belongsToMany(SlotDatas, {
//     through: SlotDataClasses,
//     foreignKey: {
//         name: "SlotDataId",
//         allowNull: false,
//     },
// });
// SlotDatas.belongsToMany(Classroom, {
//     through: SlotDataClasses,
//     foreignKey: {
//         name: "ClassroomId",
//         allowNull: false,
//     },
// });

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
await SlotDatas.sync();
await SlotDataClasses.sync();
await SlotDataSubdivisions.sync();
