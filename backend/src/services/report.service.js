import ReportModel from '../models/report.model.js';

/**
 * Report Service — User Complaints & Abuse Reporting Logic
 */

export const createReportService = async (reporterId, reportData) => {
    const report = await ReportModel.create({
        reporter: reporterId,
        reportedUser: reportData.reportedUserId,
        callSessionId: reportData.callSessionId || null,
        reason: reportData.reason,
        details: reportData.details || ""
    });

    return report;
};

export const getMyReportsService = async (reporterId) => {
    const reports = await ReportModel.find({ reporter: reporterId })
        .populate('reportedUser', 'name username avatar')
        .sort({ createdAt: -1 });

    return reports;
};

export const getAllReportsForAdminService = async (status = "pending") => {
    const reports = await ReportModel.find({ status })
        .populate('reporter', 'name username email')
        .populate('reportedUser', 'name username email isBanned')
        .sort({ createdAt: -1 });

    return reports;
};
