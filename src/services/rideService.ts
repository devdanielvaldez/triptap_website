import axios from 'axios';

const API_BASE_URL = 'https://dev.triptapmedia.com/api';

export interface PredefinedRouteDestination {
  name: string;
  prices: Array<{
    vehicleType: 'NORMAL' | 'LUXURY' | 'MINIVAN';
    price: number;
    estimatedTime: number;
  }>;
}

export interface PredefinedRoute {
  _id: string;
  origin: string;
  destinations: PredefinedRouteDestination[];
  isActive: boolean;
}

export interface TripRequestResponse {
  success: boolean;
  message: string;
  data: {
    tripId: string;
    requestId: string;
    tripCode: string;
    fare: number;
    estimatedTime: number;
    driversNotified: number;
  };
}

export const rideService = {
  async getRoutesByOrigin(origin: string): Promise<PredefinedRoute> {
    const response = await axios.get(`${API_BASE_URL}/predefined-routes/origin/${origin}`);
    return response.data;
  },

  async getFare(origin: string, destination: string, vehicleType: string): Promise<{ fare: number; estimatedTime: number }> {
    const response = await axios.get(`${API_BASE_URL}/predefined-routes/fare`, {
      params: { origin, destination, vehicleType }
    });
    return response.data;
  },

    async getTripStatus(requestId: string): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/trips/status/${requestId}`);
    return response.data;
  },

  async requestTrip(data: {
    origin: string;
    destination: string;
    vehicleType: string;
    customerId: string;
    paymentMethod: string;
  }): Promise<TripRequestResponse> {
    const response = await axios.post(`${API_BASE_URL}/trips/request`, data);
    return response.data;
  },

  async getAllRoutes(): Promise<PredefinedRoute[]> {
    const response = await axios.get(`${API_BASE_URL}/predefined-routes/all`);
    return response.data;
  }
};
