import api from './api';
import { firestoreDb } from './firestoreDb';

export const eventService = {
  async getEvents(params = {}) {
    if (firestoreDb.isAvailable()) {
      try {
        const events = await firestoreDb.getAll('events', {
          orderField: 'eventDate',
          orderDir: 'asc',
        });
        return { events };
      } catch (err) {
        console.warn('Lỗi Firestore getEvents:', err.message);
      }
    }

    try {
      const res = await api.get('/events', { params });
      return res.data?.data;
    } catch (e) {
      console.warn('Lỗi tải sự kiện từ API:', e);
      return { events: [] };
    }
  },

  async getEventById(id) {
    if (firestoreDb.isAvailable()) {
      return await firestoreDb.getById('events', id);
    }

    try {
      const res = await api.get(`/events/${id}`);
      return res.data?.data?.event;
    } catch (e) {
      console.warn('Lỗi tải chi tiết sự kiện từ API:', e);
      return null;
    }
  },

  async createEvent(data) {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('events', data);
      return { status: 'success', data: { event: created } };
    }

    const res = await api.post('/events', data);
    return res.data;
  },

  async updateEvent(id, data) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('events', id, data);
      return { status: 'success', data: { event: updated } };
    }

    const res = await api.put(`/events/${id}`, data);
    return res.data;
  },

  async deleteEvent(id) {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('events', id);
      return { status: 'success', message: 'Đã xóa sự kiện' };
    }

    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
};
