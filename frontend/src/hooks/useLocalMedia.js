import { useLocalMediaContext } from '../contexts/LocalMediaContext';

/**
 * Hook to access shared local media stream and device controls
 */
export const useLocalMedia = () => {
    return useLocalMediaContext();
};
