import MockAdapter from 'axios-mock-adapter';
import api, { publicApi } from './services/api';

const mock = new MockAdapter(api, { delayResponse: 200 });
const publicMock = new MockAdapter(publicApi, { delayResponse: 200 });

const mockUser = {
  id: '1',
  name: 'Demo Admin',
  username: 'admin',
  role: 'ADMIN',
  email: 'admin@example.com',
  prefix: 'นาย',
  student_id: '64123456',
  faculty: 'วิทยาการสารสนเทศ',
  department: 'เทคโนโลยีสารสนเทศ'
};

// Auth
publicMock.onPost('/auth/login').reply(200, {
  token: 'mock-token',
  user: mockUser
});

mock.onGet('/auth/me').reply(200, {
  user: mockUser
});

// Activities
mock.onGet('/activities').reply(200, [
  { id: 1, title: 'กิจกรรมปฐมนิเทศ', date: '2024-03-15', category: 'พัฒนานักศึกษา' },
  { id: 2, title: 'กิจกรรมจิตอาสา', date: '2024-03-20', category: 'บำเพ็ญกุศล' }
]);

mock.onGet(/\/activities\/\d+/).reply(200, {
  id: 1,
  title: 'กิจกรรมปฐมนิเทศ',
  description: 'ปฐมนิเทศนักศึกษาใหม่ ประจำปีการศึกษา 2567',
  date: '2024-03-15'
});

// Users
mock.onGet('/users/students').reply(200, [mockUser]);

export default mock;
