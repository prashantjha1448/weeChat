import ApiResponse from '../utils/ApiResponse.js';
import { createSupportTicketService, getMySupportTicketsService } from '../services/support.service.js';

// POST /api/support/ticket
export const createSupportTicket = async (req, res) => {
    const ticket = await createSupportTicketService(req.user._id, req.body);
    return res.status(201).json(new ApiResponse(201, ticket, "Support ticket created successfully"));
};

// GET /api/support/my-tickets
export const getMySupportTickets = async (req, res) => {
    const tickets = await getMySupportTicketsService(req.user._id);
    return res.status(200).json(new ApiResponse(200, tickets, "My support tickets fetched"));
};
