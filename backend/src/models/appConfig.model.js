import mongoose from 'mongoose';

/**
 * AppConfig Schema — Dynamic System Feature Flags & Global Runtime Settings
 * Human-Readable & Modular Schema Definition
 */
const AppConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, "Config key is required"],
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, "Config value is required"]
    },
    isEnabled: {
        type: Boolean,
        default: true,
        index: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    }
}, {
    timestamps: true
});

const AppConfigModel = mongoose.model('app_configs', AppConfigSchema);
export default AppConfigModel;
