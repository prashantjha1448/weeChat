import CustomRoomModel from '../models/customRoom.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

// Helper to generate 6-character random room code
const generateRoomId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `NEXUS-${code}`;
};

/**
 * POST /api/rooms/create
 * Host creates custom room with title, capacity (up to 100), room type, passcode
 */
export const createRoom = async (req, res) => {
    const { title, description, maxParticipants, roomType, isPrivate, passcode, isScheduled, scheduledAt } = req.body;

    if (!title) {
        throw new ApiError(400, 'Room title is required.');
    }

    let roomId = generateRoomId();
    while (await CustomRoomModel.findOne({ roomId })) {
        roomId = generateRoomId();
    }

    const maxCap = Math.min(Math.max(Number(maxParticipants) || 100, 2), 100);

    const room = await CustomRoomModel.create({
        roomId,
        title,
        description: description || '',
        hostId: req.user._id,
        maxParticipants: maxCap,
        roomType: roomType || 'all',
        isPrivate: Boolean(isPrivate),
        passcode: isPrivate ? passcode : undefined,
        isScheduled: Boolean(isScheduled),
        scheduledAt: isScheduled && scheduledAt ? new Date(scheduledAt) : undefined,
        participants: [{
            userId: req.user._id,
            name: req.user.name,
            username: req.user.username,
            avatar: req.user.avatar || '',
            role: 'host',
            isMuted: false,
            isCameraOff: false,
            isSharingScreen: false
        }],
        isActive: true
    });

    return res.status(201).json(
        new ApiResponse(201, room, 'Custom room created successfully')
    );
};

/**
 * GET /api/rooms/active
 * Fetch list of active public rooms
 */
export const getActiveRooms = async (req, res) => {
    const rooms = await CustomRoomModel.find({ isActive: true, isPrivate: false })
        .populate('hostId', 'name username avatar')
        .sort({ createdAt: -1 })
        .limit(50);

    const formatted = rooms.map(room => ({
        _id: room._id,
        roomId: room.roomId,
        title: room.title,
        description: room.description,
        roomType: room.roomType,
        maxParticipants: room.maxParticipants,
        participantCount: room.participants.length,
        host: room.hostId,
        isScheduled: room.isScheduled,
        scheduledAt: room.scheduledAt,
        createdAt: room.createdAt
    }));

    return res.status(200).json(
        new ApiResponse(200, formatted, 'Active rooms fetched successfully')
    );
};

/**
 * GET /api/rooms/:roomId
 * Fetch metadata for specific room
 */
export const getRoomDetails = async (req, res) => {
    const { roomId } = req.params;

    const room = await CustomRoomModel.findOne({ roomId: roomId.toUpperCase(), isActive: true })
        .populate('hostId', 'name username avatar')
        .populate('participants.userId', 'name username avatar');

    if (!room) {
        throw new ApiError(404, 'Room not found or has ended.');
    }

    return res.status(200).json(
        new ApiResponse(200, room, 'Room details fetched successfully')
    );
};

/**
 * POST /api/rooms/:roomId/join
 * Validate user can join room (check max capacity 100 & passcode)
 */
export const joinRoom = async (req, res) => {
    const { roomId } = req.params;
    const { passcode } = req.body;

    const room = await CustomRoomModel.findOne({ roomId: roomId.toUpperCase(), isActive: true }).select('+passcode');

    if (!room) {
        throw new ApiError(404, 'Room not found or has ended.');
    }

    if (room.participants.length >= room.maxParticipants) {
        throw new ApiError(403, `Room is full. Maximum limit of ${room.maxParticipants} participants reached.`);
    }

    if (room.isPrivate) {
        if (!passcode || passcode !== room.passcode) {
            throw new ApiError(401, 'Invalid room passcode.');
        }
    }

    return res.status(200).json(
        new ApiResponse(200, {
            roomId: room.roomId,
            title: room.title,
            roomType: room.roomType,
            maxParticipants: room.maxParticipants,
            isHost: String(room.hostId) === String(req.user._id)
        }, 'Joined room validation successful')
    );
};

/**
 * DELETE /api/rooms/:roomId
 * Host ends custom room
 */
export const endRoom = async (req, res) => {
    const { roomId } = req.params;

    const room = await CustomRoomModel.findOne({ roomId: roomId.toUpperCase(), isActive: true });

    if (!room) {
        throw new ApiError(404, 'Room not found.');
    }

    if (String(room.hostId) !== String(req.user._id)) {
        throw new ApiError(403, 'Only the room host can end this room.');
    }

    room.isActive = false;
    await room.save();

    return res.status(200).json(
        new ApiResponse(200, {}, 'Room ended successfully')
    );
};
