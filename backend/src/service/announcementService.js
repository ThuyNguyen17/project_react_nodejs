const Announcement = require('../models/Announcement');

const addAnnouncement = async (announcementData) => {
    const announcement = new Announcement(announcementData);
    return await announcement.save();
};

const getAllAnnouncements = async () => {
    return await Announcement.find();
};

const getAnnouncementsByAudiences = async (audiences) => {
    return await Announcement.find({ targetAudience: { $in: audiences } });
};

const createAnnouncement = async (announcementData) => {
    const announcement = new Announcement({
        ...announcementData,
        createdAt: new Date()
    });
    return await announcement.save();
};

const getAnnouncementsByRole = async (targetRole) => {
    // In Java: findByTargetRoleOrAll
    // Assumes "ALL" is a keyword for everyone
    return await Announcement.find({
        $or: [
            { targetRole: targetRole },
            { targetRole: 'ALL' }
        ]
    });
};

const getAnnouncementsByClass = async (classId) => {
    return await Announcement.find({ classId: classId });
};

const getAnnouncementsByClassAndRole = async (classId, targetRole) => {
    return await Announcement.find({ classId: classId, targetRole: targetRole });
};

const deleteAnnouncement = async (id) => {
    return await Announcement.findByIdAndDelete(id);
};

const updateAnnouncement = async (id, announcementData) => {
    return await Announcement.findByIdAndUpdate(id, announcementData, { new: true });
};

module.exports = {
    addAnnouncement,
    getAllAnnouncements,
    getAnnouncementsByAudiences,
    createAnnouncement,
    getAnnouncementsByRole,
    getAnnouncementsByClass,
    getAnnouncementsByClassAndRole,
    deleteAnnouncement,
    updateAnnouncement
};
