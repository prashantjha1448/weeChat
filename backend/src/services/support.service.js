import SupportTicketModel from '../models/supportTicket.model.js';

/**
 * Support Ticket Service — Helpdesk & Feedback Management
 */

export const createSupportTicketService = async (userId, ticketData) => {
    const ticket = await SupportTicketModel.create({
        userId,
        category: ticketData.category,
        message: ticketData.message,
        priority: ticketData.priority || "medium"
    });

    return ticket;
};

export const getMySupportTicketsService = async (userId) => {
    const tickets = await SupportTicketModel.find({ userId }).sort({ createdAt: -1 });
    return tickets;
};
