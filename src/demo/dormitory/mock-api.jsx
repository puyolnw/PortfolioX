import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios, { delayResponse: 500 });
axios.defaults.baseURL = 'http://localhost:5000';

// Auth
mock.onPost('/api/auth/login').reply(200, {
  token: 'mock-token',
  user: { id: 1, mem_name: 'Admin Demo', role: 'Admin', mem_email: 'admin@demo.com' }
});

mock.onGet('/api/auth/me').reply(200, {
  id: 1, mem_name: 'Admin Demo', role: 'Admin', mem_email: 'admin@demo.com'
});

mock.onGet('/api/notifications/navbar').reply(200, {
  overdueBills: 2,
  pendingApproval: 3
});

// Dashboard
mock.onGet('/api/dashboard/stats').reply(200, {
  roomStats: { 
    total_rooms: 63,
    empty_rooms: 15, 
    occupied_rooms: 45, 
    reserved_rooms: 3 
  },
  financialStats: {
    pending_bills: 5,
    overdue_bills: 2,
    total_revenue: 125000
  },
  overdueRooms: [
    { room_number: '101', type_name: 'Studio', tenant_name: 'John Doe', days_overdue: 5, total_amount: 5500 },
    { room_number: '204', type_name: 'Deluxe', tenant_name: 'Jane Smith', days_overdue: 3, total_amount: 7200 }
  ],
  pendingBills: [
    { room_number: '102', bill_month: '03', bill_year: '2024', tenant_name: 'Bob Ross', total_amount: 5500, payment_slip_uploaded_at: new Date() }
  ],
  monthlyRevenue: [
    { bill_month: '01', bill_year: '2024', revenue: 110000 },
    { bill_month: '02', bill_year: '2024', revenue: 115000 },
    { bill_month: '03', bill_year: '2024', revenue: 125000 }
  ]
});

mock.onGet('/api/admin/user-stats').reply(200, {
  students: 120, managers: 5, admins: 2, activeUsers: 45
});

mock.onGet('/api/admin/revenue-chart').reply(200, [
  { month: 'Oct', revenue: 145000 },
  { month: 'Nov', revenue: 152000 },
  { month: 'Dec', revenue: 148000 },
  { month: 'Jan', revenue: 160000 },
  { month: 'Feb', revenue: 155000 },
  { month: 'Mar', revenue: 158000 }
]);

mock.onGet('/api/admin/system-stats').reply(200, {
  totalUsers: 127, totalRevenue: 918000, occupancyRate: 75
});

mock.onGet('/api/admin/activity-logs').reply(200, [
  { id: 1, user_name: 'Admin Demo', action: 'Approved Bill', role: 'Admin', created_at: new Date().toISOString() },
  { id: 2, user_name: 'Manager Smith', action: 'Updated Room 101', role: 'Manager', created_at: new Date().toISOString() }
]);

// Rooms
let roomsData = [
  { 
    room_id: 1, 
    room_number: '101', 
    status: '1',
    description: 'ห้องมุม ลมโกรก',
    roomType: {
      room_type_name: 'Standard Room',
      capacity: 2,
      price_per_month: 3500,
      water_rate: 15,
      electricity_rate: 8
    }
  },
  { 
    room_id: 2, 
    room_number: '102', 
    status: '3',
    current_tenant_id: 1,
    description: '',
    roomType: {
      room_type_name: 'Standard Room',
      capacity: 2,
      price_per_month: 3500,
      water_rate: 15,
      electricity_rate: 8
    }
  },
  { 
    room_id: 3, 
    room_number: '201', 
    status: '1',
    description: 'ห้องแอร์ใหม่ เพิ่งซ่อม',
    roomType: {
      room_type_name: 'Deluxe Room',
      capacity: 2,
      price_per_month: 4500,
      water_rate: 15,
      electricity_rate: 8
    }
  },
  { 
    room_id: 4, 
    room_number: '202', 
    status: '4',
    description: 'แอร์เสีย รอซ่อม',
    roomType: {
      room_type_name: 'Deluxe Room',
      capacity: 2,
      price_per_month: 4500,
      water_rate: 15,
      electricity_rate: 8
    }
  }
];

mock.onGet(/\/api\/rooms/).reply(config => {
  return [200, roomsData];
});

mock.onPost('/api/room-types').reply(201, { room_type_id: 99 });
mock.onPost('/api/rooms').reply(201, { message: 'Success' });
mock.onPut(/\/api\/rooms\/\d+/).reply(200, { message: 'Success' });
mock.onPatch(/\/api\/rooms\/\d+\/status/).reply(200, { message: 'Success' });
mock.onDelete(/\/api\/rooms\/\d+/).reply(200, { message: 'Deleted' });

// Default pass-through for anything else if needed (or just error out for demo)
mock.onAny().passThrough();

console.log('Dormitory Mock API Initialized');
