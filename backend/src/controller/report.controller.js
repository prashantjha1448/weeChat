import ApiResponse from '../utils/ApiResponse.js';
import {
    createReportService,
    getMyReportsService,
    getAllReportsForAdminService
} from '../services/report.service.js';

// POST /api/report
export const createReport = async (req, res) => {
    const report = await createReportService(req.user._id, req.body);
    return res.status(201).json(new ApiResponse(201, report, "Report submitted successfully"));
};

// GET /api/report/my-reports
export const getMyReports = async (req, res) => {
    const reports = await getMyReportsService(req.user._id);
    return res.status(200).json(new ApiResponse(200, reports, "My submitted reports fetched"));
};

// GET /api/report/admin-all (Admin & Moderator protected)
export const getAllReportsAdmin = async (req, res) => {
    const { status } = req.query;
    const reports = await getAllReportsForAdminService(status || "pending");
    return res.status(200).json(new ApiResponse(200, reports, "All pending reports fetched for admin review"));
};
