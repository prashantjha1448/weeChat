import mongoose from 'mongoose';

/**
 * CustomRoom Schema — Multi-Participant Group Rooms (up to 100 people)
 */
const CustomRoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Room title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [300, 'Description cannot exceed 300 characters']
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    maxParticipants: {
        type: Number,
        default: 100,
        min: [2, 'Minimum 2 participants allowed'],
        max: [100, 'Maximum 100 participants allowed']
    },
    roomType: {
        type: String,
        enum: ['all', 'video', 'audio', 'chat'],
        default: 'all'
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    passcode: {
        type: String,
        select: false
    },
    participants: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        name: String,
        username: String,
        avatar: String,
        socketId: String,
        joinedAt: { type: Date, default: Date.now },
        isMuted: { type: Boolean, default: false },
        isCameraOff: { type: Boolean, default: false },
        isSharingScreen: { type: Boolean, default: false },
        role: { type: String, enum: ['host', 'co-host', 'member'], default: 'member' }
    }],
    isScheduled: {
        type: Boolean,
        default: false
    },
    scheduledAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true
});

const CustomRoomModel = mongoose.model('custom_rooms', CustomRoomSchema);
export default CustomRoomModel;
