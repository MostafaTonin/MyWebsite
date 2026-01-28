
import axios from './axios';
import type { SiteSection } from '../types/api';

export const siteSectionsApi = {
    getAll: async () => {
        const { data } = await axios.get<SiteSection[]>('/SiteSections');
        return data;
    },

    updateAll: async (sections: SiteSection[]) => {
        const { data } = await axios.put<SiteSection[]>('/SiteSections', sections);
        return data;
    }
};
