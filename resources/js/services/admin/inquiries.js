import { fetchJson } from '../../utils/fetchJson.js';

const INQUIRIES_KEY = 'lml_inquiries';

export async function initInquiries() {
  if (!localStorage.getItem(INQUIRIES_KEY)) {
    try {
      const inquiries = await fetchJson('/resources/json/inquiries.json');
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    } catch (error) {
      console.error('Failed to load inquiries data:', error);
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify([]));
    }
  }
}

export function getInquiries() {
  return JSON.parse(localStorage.getItem(INQUIRIES_KEY) || '[]');
}

export function updateInquiryStatus(id, status) {
  const inquiries = getInquiries();
  const updatedInquiries = inquiries.map(inquiry => 
    inquiry.id === id ? { ...inquiry, status } : inquiry
  );
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updatedInquiries));
  return updatedInquiries;
}

export function addInquiry(inquiry) {
  const inquiries = getInquiries();
  const newInquiry = {
    ...inquiry,
    id: Date.now(),
    date: new Date().toISOString(),
    status: 'pending'
  };
  inquiries.push(newInquiry);
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  return newInquiry;
}