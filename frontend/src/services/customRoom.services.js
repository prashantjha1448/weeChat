import api from '../api/axios.js';

export const createRoomApi = async (data) => {
    const response = await api.post('rooms/create', data);
    return response.data;
};

export const getActiveRoomsApi = async () => {
    const response = await api.get('rooms/active');
    return response.data;
};

export const getRoomDetailsApi = async (roomId) => {
    const response = await api.get(`rooms/${roomId}`);
    return response.data;
};

export const joinRoomApi = async (roomId, passcode) => {
    const response = await api.post(`rooms/${roomId}/join`, { passcode });
    return response.data;
};

export const endRoomApi = async (roomId) => {
    const response = await api.delete(`rooms/${roomId}`);
    return response.data;
};
