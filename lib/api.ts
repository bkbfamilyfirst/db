import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refreshing
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the request failed due to network issues (backend not available)
    if (!error.response) {
      console.warn('Network error - backend may not be available:', error.message);
      return Promise.reject(error);
    }

    // Check if the error is 401 Unauthorized and not already retrying
      // Do not attempt to refresh token for auth endpoints (login/refresh-token)
      const requestUrl = originalRequest?.url || '';
      if ((requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh-token')) && error.response?.status === 401) {
        // Propagate 401 from auth endpoints (e.g., wrong credentials) immediately
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {        // Attempt to refresh the token
        const response = await api.post('/auth/refresh-token');
        const newAccessToken = response.data.accessToken;
        
        // Update the stored access token
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newAccessToken);
        }

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);      } catch (refreshError) {
        // If refresh fails, clear auth data but don't redirect here
        // Let the AuthProvider handle the redirect to prevent conflicts
        console.error('Failed to refresh token:', refreshError);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          // Don't redirect directly here - let AuthProvider handle it
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface LoginCredentials {
  identifier: string;
  password: string;
  role: string
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardSummary {
  receivedKeys: number;
  receivedKeysDetails: {
    changeFromLastWeek: number;
    today: number;
    thisWeek: number;
    lastBatch: {
      count: number;
      from: string;
      date: string;
    } | null;
  };
  balanceKeys: number;
  transferStatus: number;
  transferredKeys: number;
  available: number;
  // New optional keyStats to match /db/dashboard/key-stats response shape
  keyStats?: KeyStats;
  retailerCount: {
    totalActiveRetailers: number;
    growthThisMonth: string;
    regionalDistribution: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  dailyActivations: {
    today: number;
    avgDaily: number;
    weeklyPerformance: Array<{
      day: string;
      activations: number;
      target?: number;
      percentage: number;
    }>;
    thisWeekSummary?: {
      count: number;
      target: number;
      percentage: number;
      remaining: number;
    };
  };
}

export interface KeyDistributionStats {
  totalKeys: number;
  distributedKeys: number;
  pendingDistribution: number;
  remainingKeys: number;
}

export interface ActivationSummary {
  activationSummary: {
    today: {
      count: number;
      target: number;
      percentage: number;
      remaining: number;
    };
    thisWeek: {
      count: number;
      target: number;
      percentage: number;
      remaining: number;
    };
    thisMonth: {
      count: number;
      target: number;
      percentage: number;
      remaining: number;
    };
  };
  topPerformingRetailers: Array<{
    id: string;
    name: string;
    activations: number;
    performance: number;
  }>;
}

export interface Retailer {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'blocked';
  receivedKeys: number;
  transferredKeys: number;
  balanceKeys?: number;
  activations?: number;
  createdAt: string;
  updatedAt: string;
  role: string;
  createdBy: string;
}

export interface AddRetailerData {
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  status?: 'active' | 'inactive' | 'blocked';
  receivedKeys?: number;
}

export interface UpdateRetailerData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'blocked';
}

export interface TransferKeysData {
  retailerId: string;
  keysToTransfer: number;
  notes?: string;
}

export interface KeyTransferLog {
  _id: string;
  transferId: string;
  fromUser: {
    _id: string;
    name: string;
    role: string;
  } | null;
  toUser: {
    _id: string;
    name: string;
    role: string;
  };
  count: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  notes?: string;
  type?: string;
}

export interface DbProfile {
  personalInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
  };
  profileStats: {
    joined: string;
    lastLogin: string | null;
    quickStats: {
      retailers: number;
      keysManaged: number;
    };
  };
}

export interface UpdateDbProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface RetailerActivation {
  _id: string;
  parentName: string;
  childName: string;
  activationDate: string;
  status: 'active' | 'expired';
}

// Updated RecentKeyBatch interface to match the actual API response structure
export interface RecentKeyBatch {
  batchId: string;       // from API: batch._id
  batchInfo: string;     // from API: batch.notes || 'Standard batch delivery'
  quantity: number;      // from API: batch.count
  ssReference: string;   // from API: batch.reference || `REF-SS-${batch._id.toString().slice(-3).toUpperCase()}`
  receivedDate: string;  // from API: batch.date (ensure this is a string like ISO date)
  status: "Pending" | "Received" | "Verified" | "Distributed" | "Partially Distributed"; // from API: batch.status
  // Deprecated fields based on new API structure (can be removed if not used elsewhere):
  // batch_id?: string; 
  // batch_number?: string;
  // key_quantity?: number;
  // received_date?: string;
  // batch_status?: "Pending" | "Received" | "Verified" | "Distributed" | "Partially Distributed";
  // ss_reference_id?: string;
  // notes?: string;
}

export interface DistributionHistory {
  transferId: string;        // from backend: entry._id
  retailer: {
    id: string;              // from backend: entry.toUser._id
    name: string;            // from backend: entry.toUser.name
    email: string;           // from backend: entry.toUser.email
  };
  quantity: number;          // from backend: entry.count
  batch: string;            // from backend: entry.notes || `DB-Batch-${entry._id.toString().slice(-5).toUpperCase()}`
  region: string;           // from backend: entry.toUser.location
  date: string;             // from backend: entry.date
  status: 'completed' | 'pending' | 'failed'; // from backend: entry.status
}

export interface MovementHistory {
  _id: string;
  type: 'received' | 'distributed' | 'adjusted';
  count: number;
  date: string;
  from?: string; // e.g., "Super Distributor" or "System Adjustment"
  to?: string;   // e.g., "Retailer Name" or "System Adjustment"
  notes?: string;
}

export interface KeyStats {
  totalInventory: number;
  receivedFromSs: {
    total: number;
    thisWeek: number;
  };
  distributed: {
    total: number;
    pending: number;
  };
  available: {
    total: number;
    lowStockAlert?: string; // Optional as it might not always be present
  };
  keyDistributionOverview: {
    distributionProgress: number;
    distributed: number;
    remaining: number;
    total: number;
  };
}

export interface ReceiveKeysData {
  batchId: string;
  count: number;
  receivedDate: string; // Or Date, depending on how you handle dates
  notes?: string;
}

// Added new interface for receiving keys from SS
export interface ReceiveKeysFromSsData {
  batchNumber: string;
  quantity: number;
  ssReference: string;
  notes?: string;
}

export interface DistributeKeysData {
  retailerId: string; // Assuming distribution is to a single retailer at a time
  count: number;
  distributedDate: string; // Or Date
  notes?: string;
}

export interface RecentKeyBatchesResponse {
  total: number;
  page: number;
  limit: number;
  batches: RecentKeyBatch[]; // Changed from KeyBatch[] to RecentKeyBatch[]
}

// City distribution types for dashboard
export interface CityDistributionItem {
  city: string | null;
  count: number;
}

export interface CityDistributionResponse {
  total: number;
  topCities: CityDistributionItem[];
  others?: number;
  unknown?: number;
}

// =============================================================================
// AUTHENTICATION API FUNCTIONS
// =============================================================================

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', credentials);
    // Store access token in localStorage
    if (response.data.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('Login error:', message, error);
    throw new Error(message);
  }
};

// Fetch retailer city distribution statistics
export const getRetailerCityDistribution = async (opts?: { limit?: number }) : Promise<CityDistributionResponse> => {
  try {
    const res = await api.get('/db/retailers/stats/cities', { params: opts })
    return res.data as CityDistributionResponse
  } catch (error) {
    const message = getErrorMessage(error)
    console.error('Failed to fetch city distribution:', message)
    throw new Error(message)
  }
}

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Even if logout fails, remove token locally
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    throw error;
  }
};

export const refreshToken = async (): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post('/auth/refresh-token');
    
    if (response.data.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// =============================================================================
// DASHBOARD API FUNCTIONS
// =============================================================================

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response: AxiosResponse<DashboardSummary> = await api.get('/db/dashboard/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

export const getKeyDistributionStats = async (): Promise<KeyDistributionStats> => {
  try {
    const response: AxiosResponse<KeyDistributionStats> = await api.get('/db/dashboard/key-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching key distribution stats:', error);
    throw error;
  }
};

export const getActivationSummary = async (): Promise<ActivationSummary> => {
  try {
    const response: AxiosResponse<ActivationSummary> = await api.get('/db/dashboard/activation-summary');
    return response.data;
  } catch (error: any) {
    // Provide a friendlier error for forbidden access (403) and log for diagnostics
    const status = error?.response?.status;
    if (status === 403) {
      const friendly = 'Access denied: you do not have permission to view activation summary.';
      console.warn('Activation summary forbidden (403):', error?.response?.data || error);
      // Allow components to receive a clear Error with friendly message
      throw new Error(friendly);
    }

    console.error('Error fetching activation summary:', error);
    throw error;
  }
};

// =============================================================================
// KEY MANAGEMENT API FUNCTIONS
// =============================================================================

/**
 * Fetches key statistics for the dashboard.
 * @returns {Promise<AxiosResponse<KeyStats>>} A promise that resolves to the key statistics.
 */
export const getKeyStats = async (): Promise<AxiosResponse<KeyStats>> => {
  return api.get<KeyStats>('/db/dashboard/key-stats');
};

/**
 * Fetches recent key batches.
 * @param params Optional parameters for pagination (page, limit).
 * @returns {Promise<RecentKeyBatchesResponse>} A promise that resolves to the recent key batches.
 */
export const getRecentKeyBatches = async (params?: {
  page?: number;
  limit?: number;
}): Promise<RecentKeyBatchesResponse> => {
  const response = await api.get<RecentKeyBatchesResponse>('/db/recent-key-batches', { params });
  return response.data;
};

export const receiveKeysFromSs = async (receiveData: ReceiveKeysFromSsData): Promise<{ message: string; batch: RecentKeyBatch }> => {
  try {
    // Updated endpoint and request data structure
    const response = await api.post('/db/receive-keys-from-ss', receiveData);
    return response.data;
  } catch (error) {
    console.error('Error receiving keys from SS:', error);
    throw error;
  }
};

export const distributeKeysToRetailer = async (distributeData: DistributeKeysData): Promise<{ message: string; distribution: DistributionHistory }> => {
  try {
    const response = await api.post('/db/key-management/distribute', distributeData);
    return response.data;
  } catch (error) {
    console.error('Error distributing keys to retailer:', error);
    throw error;
  }
};

export const getKeyMovementHistory = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ message: string; history: MovementHistory[]; total: number; page: number; limit: number }> => {
  try {
    const response = await api.get('/db/key-management/movement-history', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching key movement history:', error);
    throw error;
  }
};

// The following are general Key Management functions, not specific to Retailers
export const getKeyTransferLogs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  type?: string;
}): Promise<{ logs: KeyTransferLog[]; total: number }> => {
  try {
    const response = await api.get('/db/key-transfer-logs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching key transfer logs:', error);
    throw error;
  }
};

export const handleKeyBatchAction = async (
  batchId: string, 
  actionType: string, 
  data?: any
): Promise<{ message: string }> => {
  try {
    const response = await api.put(`/db/recent-key-batches/${batchId}/${actionType}`, data);
    return response.data;
  } catch (error) {
    console.error('Error handling key batch action:', error);
    throw error;
  }
};

export const getDistributionHistory = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ distributions: DistributionHistory[]; total: number }> => {
  try {
    const response = await api.get('/db/distribution-history', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching distribution history:', error);
    throw error;
  }
};

export const handleDistributionHistoryAction = async (
  distributionId: string, 
  actionType: string, 
  data?: any
): Promise<{ message: string }> => {
  try {
    const response = await api.put(`/db/distribution-history/${distributionId}/${actionType}`, data);
    return response.data;
  } catch (error) {
    console.error('Error handling distribution history action:', error);
    throw error;
  }
};

// This was a duplicate of distributeKeysToRetailer, renamed to distributeKeysToRetailers for clarity if it serves a different purpose or removed if truly a duplicate.
// Assuming it might be for batch distribution, I'll keep it with a slightly different name.
// If it's an exact duplicate, it should be removed.
export const distributeKeysToRetailers = async (distributeData: DistributeKeysData): Promise<{ message: string; distributions: DistributionHistory[] }> => {
  try {
    const response = await api.post('/db/distribute-keys-to-retailers', distributeData);
    return response.data;
  } catch (error) {
    console.error('Error distributing keys to retailers:', error);
    throw error;
  }
};

export const getMovementHistory = async (params?: {
  page?: number;
  limit?: number;
  type?: 'received' | 'distributed';
  startDate?: string;
  endDate?: string;
}): Promise<{ movements: MovementHistory[]; total: number }> => {
  try {
    const response = await api.get('/db/movement-history', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching movement history:', error);
    throw error;
  }
};


// -----------------------------------------------------------------------------
// RETAILER MANAGEMENT APIS
// -----------------------------------------------------------------------------

export const getRetailerList = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  address?: string;
}): Promise<{ message: string; retailers: Retailer[] }> => {
  try {
    const response = await api.get('/db/retailers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching retailer list:', error);
    throw error;
  }
};

export const addRetailer = async (retailerData: AddRetailerData): Promise<{
  password: string; message: string; retailer: Retailer; defaultPassword?: string 
}> => {
  try {
    const response = await api.post('/db/retailers', retailerData);
    return response.data;
  } catch (error) {
    console.error('Error adding retailer:', error);
    throw error;
  }
};

export const updateRetailer = async (
  retailerId: string, 
  updateData: UpdateRetailerData
): Promise<{ message: string; retailer: Retailer }> => {
  try {
    const response = await api.put(`/db/retailers/${retailerId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating retailer:', error);
    throw error;
  }
};

export const deleteRetailer = async (retailerId: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/db/retailers/${retailerId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting retailer:', error);
    throw error;
  }
};

/**
 * Change a retailer's password.
 * POST /db/retailers/:retailerId/change-password
 */
export const changeRetailerPassword = async (retailerId: string, newPassword: string): Promise<{ message: string }> => {
  try {
    const response = await api.post(`/db/retailers/${retailerId}/change-password`, { newPassword });
    return response.data;
  } catch (error) {
    console.error('Error changing retailer password:', error);
    throw error;
  }
};

export const transferKeysToRetailer = async (transferData: TransferKeysData): Promise<{ message: string; transferLog: KeyTransferLog }> => {
  try {
    const response = await api.post('/db/transfer-keys-to-retailer', transferData);
    return response.data;
  } catch (error) {
    console.error('Error transferring keys to retailer:', error);
    throw error;
  }
};

export const getRetailerActivations = async (
  retailerId: string,
  params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ activations: RetailerActivation[]; total: number }> => {
  try {
    const response = await api.get(`/db/retailers/${retailerId}/activations`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching retailer activations:', error);
    throw error;
  }
};

// =============================================================================
// PROFILE API FUNCTIONS
// =============================================================================

export const getDbProfile = async (): Promise<DbProfile> => {
  try {
    const profileResponse: AxiosResponse<DbProfile> = await api.get('/db/profile');
    return profileResponse.data;
  } catch (error) {
    console.error('Error fetching DB profile:', error);
    throw error;
  }
};

export const updateDbProfile = async (dataToUpdate: UpdateDbProfileData): Promise<{ message: string; profile: { firstName: string; lastName: string; email: string; phone: string; address: string; bio: string; } }> => {
  try {
    const updateResponse = await api.put('/db/profile', dataToUpdate);
    return updateResponse.data;
  } catch (error) {
    console.error('Error updating DB profile:', error);
    throw error;
  }
};

// =============================================================================
// UTILITY FUNCTIONS (ensure this section exists and is correct)
// =============================================================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
};

/**
 * Format error message from API response
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Handle API errors (e.g., log them, show toast)
 */
export const handleApiError = (error: any, customMessage?: string): void => {
  const errorMessage = customMessage || getErrorMessage(error);
  console.error('API Error:', errorMessage, error);
  // Here you would typically integrate with a toast notification system
  // For example: toast.error(errorMessage);
  // Since this is a library, actual toast invocation is better done in components
  // or a dedicated error handling service that uses this function.
};

export default api;

// =============================================================================
// DISTRIBUTION TYPES (ensure this is defined)
// =============================================================================
export interface Distribution {
  id: string;
  retailerName: string;
  retailerId: string;
  quantity: number;
  distributedDate: string; // Should be ISO string or Date
  status: "pending" | "sent" | "delivered" | "confirmed";
  batchNumber: string;
  region: string;
}

export interface CreateDistributionData {
  retailerId: string;
  quantity: number;
  batchNumber: string;
}

// =============================================================================
// RETAILER TYPES (for selection in distribution)
// =============================================================================
export interface RetailerSelectionInfo { 
  id: string;
  name: string;
  region: string;
}

// =============================================================================
// ACTIVITY TYPES (ensure this is defined)
// =============================================================================
export interface ActivityUser {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Activity {
  id: string; 
  user: ActivityUser;
  action: string;
  target: string;
  time: string; 
  type: "success" | "info" | "warning" | "error";
}

// =============================================================================
// API FUNCTIONS (ensure these are defined and exported)
// =============================================================================

// Distributions
export const getDistributions = async (): Promise<Distribution[]> => {
  try {
    // Use the correct endpoint from backend: /db/distribution-history
    const response: AxiosResponse<{ history: DistributionHistory[]; total: number }> = 
      await api.get('/db/distribution-history');
    
    // Map DistributionHistory[] to Distribution[]
    const distributions: Distribution[] = response.data.history.map(item => ({
      id: item.transferId,
      retailerId: item.retailer.id,
      retailerName: item.retailer.name,
      quantity: item.quantity,
      distributedDate: item.date,
      status: item.status as Distribution['status'],
      batchNumber: item.batch,
      region: item.region,
    }));
    
    return distributions;
  } catch (error) {
    handleApiError(error, 'Failed to fetch distributions from /db/distribution-history'); 
    return []; 
  }
};

export const createDistribution = async (data: CreateDistributionData): Promise<Distribution> => {
  try {
    // Corrected endpoint to match backend routes in db.js
    const response: AxiosResponse<{ message: string; distributions: DistributionHistory[] }> = 
      await api.post('/db/distribute-keys-to-retailers', data);

    if (response.data.distributions && response.data.distributions.length > 0) {
      const createdDh = response.data.distributions[0]; // Assuming the first one is the newly created one      // Map DistributionHistory to Distribution
      const newDistribution: Distribution = {
        id: createdDh.transferId,
        retailerId: createdDh.retailer.id,
        retailerName: createdDh.retailer.name,
        quantity: createdDh.quantity,
        distributedDate: createdDh.date,
        status: createdDh.status as Distribution['status'], // Ensure status types are compatible
        batchNumber: data.batchNumber, // Carry over from input data as DistributionHistory might not have it
        region: createdDh.region || 'N/A', // Use region from backend
      };
      return newDistribution;
    } else {
      // This case should ideally not happen if creation is successful and returns the item
      console.error('Create distribution call to /db/distribute-keys-to-retailers did not return the expected distribution object:', response.data);
      throw new Error('Failed to create distribution: No distribution data returned.');
    }
  } catch (error) {
    handleApiError(error, 'Failed to create distribution via /db/distribute-keys-to-retailers');
    throw error; 
  }
};

export const updateDistributionStatus = async (distributionId: string, status: Distribution['status']): Promise<Distribution> => {
  try {
    // Map UI status to backend action types
    let actionType: string;
    switch (status) {
      case 'confirmed':
        actionType = 'confirm';
        break;
      case 'sent':
        actionType = 'mark-sent';
        break;
      case 'delivered':
        actionType = 'mark-delivered';
        break;
      case 'pending':
        actionType = 'reset-to-pending';
        break;
      default:
        throw new Error(`Invalid status: ${status}`);
    }

    // Call the backend action endpoint
    const response: AxiosResponse<{ message: string }> = await api.put(`/db/distribution-history/${distributionId}/${actionType}`);
    
    // Since the backend doesn't return the updated Distribution object, we need to construct it
    // For now, we'll return a basic object with the updated status
    // In practice, you might want to refetch the distribution or return more data from backend
    const updatedDistribution: Distribution = {
      id: distributionId,
      status: status,
      // Note: Other fields would need to be preserved from the original distribution
      // This is a simplified implementation
      retailerName: '',
      retailerId: '',
      quantity: 0,
      distributedDate: '',
      batchNumber: '',
      region: ''
    };
    
    return updatedDistribution;
  } catch (error) {
    console.error('Error updating distribution status:', error);
    handleApiError(error);
    throw error; 
  }
};

// Retailers (for selection)
const RETAILER_SELECTION_CACHE_KEY = 'FF_RETAILER_SELECTION_CACHE';
const RETAILER_CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const getRetailers = async (): Promise<RetailerSelectionInfo[]> => { 
  // Try to load from cache
  if (typeof window !== 'undefined') {
    const cachedDataString = localStorage.getItem(RETAILER_SELECTION_CACHE_KEY);
    if (cachedDataString) {
      try {
        const cachedData = JSON.parse(cachedDataString);
        if (cachedData && cachedData.timestamp && (Date.now() - cachedData.timestamp < RETAILER_CACHE_DURATION_MS) && cachedData.data) {
          console.log("Returning cached retailers for selection:", cachedData.data);
          return cachedData.data as RetailerSelectionInfo[];
        }
      } catch (e) {
        console.error("Error parsing cached retailers:", e);
        localStorage.removeItem(RETAILER_SELECTION_CACHE_KEY); // Clear corrupted cache
      }
    }
  }

  // If cache is not available or stale, fetch from API
  try {
    console.log("Fetching retailers from API (/db/retailers)...");
    // Expecting response: { message: string; retailers: Retailer[] }
    const response: AxiosResponse<{ message: string; retailers: Retailer[] }> = await api.get('/db/retailers'); 
    console.log("API response from /db/retailers:", response);

    if (response.data && Array.isArray(response.data.retailers)) {      const retailersSelectionInfo: RetailerSelectionInfo[] = response.data.retailers.map(retailer => ({
        id: retailer._id, // Map _id to id
        name: retailer.name,
        region: retailer.address || 'N/A', // Map address to region, default to 'N/A'
      }));

      if (typeof window !== 'undefined') {
        const cachePayload = {
          timestamp: Date.now(),
          data: retailersSelectionInfo,
        };
        localStorage.setItem(RETAILER_SELECTION_CACHE_KEY, JSON.stringify(cachePayload));
        console.log("Fetched and cached retailers for selection (from /db/retailers):", retailersSelectionInfo);
      }
      return retailersSelectionInfo;
    } else {
      console.warn("/db/retailers did not return the expected data structure. Response data:", response.data);
      // Attempt to clear cache if data structure is wrong, to force a fresh fetch next time.
      if (typeof window !== 'undefined') {
        localStorage.removeItem(RETAILER_SELECTION_CACHE_KEY);
      }
      return [];
    }
  } catch (error) {
    handleApiError(error);
    console.error("Error fetching retailers from API (/db/retailers):", error);
    return []; 
  }
};

// Recent Activities
export const getRecentActivities = async (): Promise<Activity[]> => {
  try {
    const response: AxiosResponse<Activity[]> = await api.get('/activities/recent'); // Ensure this endpoint is correct
    return response.data;
  } catch (error) {
    handleApiError(error); // Uses the utility function
    return []; 
  }
};
