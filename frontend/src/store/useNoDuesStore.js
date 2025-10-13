import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNoDuesStore = create(
  persist(
    (set, get) => ({
      // Student applications
      applications: [
        {
          id: 1,
          studentId: '2023001',
          studentName: 'John Doe',
          email: 'john.doe@university.edu',
          submittedAt: '2024-01-15T10:30:00Z',
          status: 'pending',
          timeline: [
            { unit: 'Department', status: 'approved', timestamp: '2024-01-15T11:00:00Z' },
            { unit: 'Library', status: 'pending', timestamp: null },
            { unit: 'Accounts', status: 'pending', timestamp: null },
            { unit: 'Hostel', status: 'pending', timestamp: null },
            { unit: 'Proctor', status: 'pending', timestamp: null },
            { unit: 'Sports', status: 'pending', timestamp: null },
          ],
          queries: [],
        },
        {
          id: 2,
          studentId: '2023002',
          studentName: 'Jane Smith',
          email: 'jane.smith@university.edu',
          submittedAt: '2024-01-10T14:20:00Z',
          status: 'approved',
          timeline: [
            { unit: 'Department', status: 'approved', timestamp: '2024-01-10T15:00:00Z' },
            { unit: 'Library', status: 'approved', timestamp: '2024-01-11T09:00:00Z' },
            { unit: 'Accounts', status: 'approved', timestamp: '2024-01-12T10:00:00Z' },
            { unit: 'Hostel', status: 'approved', timestamp: '2024-01-13T11:00:00Z' },
            { unit: 'Proctor', status: 'approved', timestamp: '2024-01-14T12:00:00Z' },
            { unit: 'Sports', status: 'approved', timestamp: '2024-01-15T13:00:00Z' },
          ],
          queries: [],
        },
      ],

      // Queries
      queries: [
        {
          id: 1,
          applicationId: 1,
          unit: 'Library',
          message: 'Please return the overdue book "Advanced Mathematics"',
          status: 'pending',
          createdAt: '2024-01-16T09:00:00Z',
          studentReply: null,
        },
        {
          id: 2,
          applicationId: 1,
          unit: 'Accounts',
          message: 'Outstanding fee payment of ₹5,000 required',
          status: 'resolved',
          createdAt: '2024-01-15T14:00:00Z',
          studentReply: 'Payment completed on 2024-01-16',
        },
      ],

      // Students data
      students: [
        {
          id: 1,
          studentId: '2023001',
          name: 'John Doe',
          email: 'john.doe@university.edu',
          phone: '+91 9876543210',
          course: 'Computer Science',
          year: '2023',
          status: 'active',
        },
        {
          id: 2,
          studentId: '2023002',
          name: 'Jane Smith',
          email: 'jane.smith@university.edu',
          phone: '+91 9876543211',
          course: 'Electronics',
          year: '2023',
          status: 'active',
        },
      ],

      // Units data
      units: [
        { id: 1, name: 'Department', type: 'department', status: 'active' },
        { id: 2, name: 'Library', type: 'library', status: 'active' },
        { id: 3, name: 'Accounts', type: 'accounts', status: 'active' },
        { id: 4, name: 'Hostel', type: 'hostel', status: 'active' },
        { id: 5, name: 'Proctor', type: 'proctor', status: 'active' },
        { id: 6, name: 'Sports', type: 'sports', status: 'active' },
      ],

      // Actions
      submitApplication: (applicationData) => {
        const newApplication = {
          id: Date.now(),
          ...applicationData,
          submittedAt: new Date().toISOString(),
          status: 'pending',
          timeline: [
            { unit: 'Department', status: 'pending', timestamp: null },
            { unit: 'Library', status: 'pending', timestamp: null },
            { unit: 'Accounts', status: 'pending', timestamp: null },
            { unit: 'Hostel', status: 'pending', timestamp: null },
            { unit: 'Proctor', status: 'pending', timestamp: null },
            { unit: 'Sports', status: 'pending', timestamp: null },
          ],
          queries: [],
        };
        set((state) => ({
          applications: [...state.applications, newApplication],
        }));
        return newApplication;
      },

      updateApplicationStatus: (applicationId, unit, status) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  timeline: app.timeline.map((item) =>
                    item.unit === unit
                      ? { ...item, status, timestamp: new Date().toISOString() }
                      : item
                  ),
                }
              : app
          ),
        }));
      },

      addQuery: (queryData) => {
        const newQuery = {
          id: Date.now(),
          ...queryData,
          createdAt: new Date().toISOString(),
          status: 'pending',
          studentReply: null,
        };
        set((state) => ({
          queries: [...state.queries, newQuery],
        }));
        return newQuery;
      },

      replyToQuery: (queryId, reply) => {
        set((state) => ({
          queries: state.queries.map((query) =>
            query.id === queryId
              ? { ...query, studentReply: reply, status: 'resolved' }
              : query
          ),
        }));
      },

      addStudent: (studentData) => {
        const newStudent = {
          id: Date.now(),
          ...studentData,
          status: 'active',
        };
        set((state) => ({
          students: [...state.students, newStudent],
        }));
        return newStudent;
      },

      updateStudent: (studentId, updates) => {
        set((state) => ({
          students: state.students.map((student) =>
            student.id === studentId ? { ...student, ...updates } : student
          ),
        }));
      },

      deleteStudent: (studentId) => {
        set((state) => ({
          students: state.students.filter((student) => student.id !== studentId),
        }));
      },

      addUnit: (unitData) => {
        const newUnit = {
          id: Date.now(),
          ...unitData,
          status: 'active',
        };
        set((state) => ({
          units: [...state.units, newUnit],
        }));
        return newUnit;
      },

      updateUnit: (unitId, updates) => {
        set((state) => ({
          units: state.units.map((unit) =>
            unit.id === unitId ? { ...unit, ...updates } : unit
          ),
        }));
      },

      deleteUnit: (unitId) => {
        set((state) => ({
          units: state.units.filter((unit) => unit.id !== unitId),
        }));
      },
    }),
    { 
      name: 'nodues-storage',
      version: 1,
    }
  )
);

export default useNoDuesStore;
