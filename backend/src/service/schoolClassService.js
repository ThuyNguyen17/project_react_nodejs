const SchoolClass = require('../models/SchoolClass');

const addClass = async (classData) => {
    const schoolClass = new SchoolClass(classData);
    return await schoolClass.save();
};

const getAllClasses = async () => {
    const classes = await SchoolClass.find();
    // Simplified conversion, more logic needed if DTO mapping is complex
    return classes.map(c => ({
        id: c._id,
        academicYearId: c.academicYearId,
        gradeLevel: c.gradeLevel,
        className: c.className,
        homeroomTeacherId: c.homeroomTeacherId
    }));
};

const getClassById = async (id) => {
    const schoolClass = await SchoolClass.findById(id);
    if (!schoolClass) throw new Error(`SchoolClass not found with id: ${id}`);
    return schoolClass;
};

const deleteClass = async (id) => {
    return await SchoolClass.findByIdAndDelete(id);
};

const updateClass = async (id, classData) => {
    return await SchoolClass.findByIdAndUpdate(id, classData, { new: true });
};

module.exports = {
    addClass,
    getAllClasses,
    getClassById,
    deleteClass,
    updateClass
};
