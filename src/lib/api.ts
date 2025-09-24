const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async register(userData: any) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Poems methods
  async getPoems(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/poems?${params}`);
  }

  async getPoem(id: string) {
    return this.request(`/poems/${id}`);
  }

  async createPoem(poemData: any) {
    return this.request('/poems', {
      method: 'POST',
      body: JSON.stringify(poemData),
    });
  }

  // Readings methods
  async getReadings(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/readings?${params}`);
  }

  async createReading(readingData: any) {
    return this.request('/readings', {
      method: 'POST',
      body: JSON.stringify(readingData),
    });
  }

  async updateReading(id: string, readingData: any) {
    return this.request(`/readings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(readingData),
    });
  }

  async getReadingStats() {
    return this.request('/readings/stats');
  }

  // Favorites methods
  async getFavorites() {
    return this.request('/favorites');
  }

  async addToFavorites(poemId: string) {
    return this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ poemId }),
    });
  }

  async removeFromFavorites(poemId: string) {
    return this.request(`/favorites/${poemId}`, {
      method: 'DELETE',
    });
  }

  async checkFavorite(poemId: string) {
    return this.request(`/favorites/check/${poemId}`);
  }

  // Progress methods
  async getProgress(weeks?: number) {
    const params = weeks ? `?weeks=${weeks}` : '';
    return this.request(`/progress${params}`);
  }

  async getCurrentProgress() {
    return this.request('/progress/current');
  }

  async getClassProgress() {
    return this.request('/progress/class');
  }

  async getAnalytics(period?: string) {
    const params = period ? `?period=${period}` : '';
    return this.request(`/progress/analytics${params}`);
  }

  // Users methods
  async getStudents(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/users/students?${params}`);
  }

  async addStudent(studentData: any) {
    return this.request('/users/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id: string, studentData: any) {
    return this.request(`/users/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async removeStudent(id: string) {
    return this.request(`/users/students/${id}`, {
      method: 'DELETE',
    });
  }

  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
}

export const apiClient = new ApiClient();