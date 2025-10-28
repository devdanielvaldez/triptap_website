
import axios from 'axios';

const API_URL = 'https://dev.triptapmedia.com/api';

export interface PricingConfig {
  _id: string;
  videoCostPerView: number;
  imageCostPerPresentation: number;
}

export const pricingConfigService = {
  getPricingConfig: async (): Promise<PricingConfig> => {
    const response = await axios.get(`${API_URL}/pricing/config`);
    return response.data[0];
  },

  updatePricingConfig: async (data: Partial<PricingConfig>): Promise<PricingConfig> => {
    const response = await axios.put(`${API_URL}/pricing/config`, data);
    return response.data;
  }
};