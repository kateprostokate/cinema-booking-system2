class ApiService {
  static BASE_URL = 'https://shfe-diplom.neto-server.ru';

  static async request(endpoint, options = {}) {
    const response = await fetch(`${this.BASE_URL}/${endpoint}`, options);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }
    return data.result;
  }

  static getAllData() {
    return this.request('alldata');
  }

  static login(params) {
    return this.request('login', { method: 'POST', body: params });
    }

  static createHall(params) {
    return this.request('hall', { method: 'POST', body: params });
  }

  static deleteHall(id) {
    return this.request(`hall/${id}`, { method: 'DELETE' });
  }

  static updateHallConfig(id, params) {
    return this.request(`hall/${id}`, { method: 'POST', body: params });
  }
  
  static updateHallPrice(id, params) {
    return this.request(`price/${id}`, { method: 'POST', body: params });
  }

  static updateHallOpen(id, params) {
    return this.request(`open/${id}`, { method: 'POST', body: params });
  }

  static createFilm(params) {
    return this.request('film', { method: 'POST', body: params });
  }

  static deleteFilm(id) {
    return this.request(`film/${id}`, { method: 'DELETE' });
  }
  
  static createSeance(params) {
    return this.request('seance', { method: 'POST', body: params });
  }

  static deleteSeance(id) {
    return this.request(`seance/${id}`, { method: 'DELETE' });
  }

  static getHallConfig(seanceId, date) {
    return this.request(`hallconfig?seanceId=${seanceId}&date=${date}`);
  }

  static buyTickets(params) {
    return this.request('ticket', { method: 'POST', body: params });
  }
}

export default ApiService;
