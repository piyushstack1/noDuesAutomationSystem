import prisma from './prisma/index.js';

async function seed() {
  try {
    console.log('Starting database seeding...');

    // Create admin if doesn't exist
    const adminExists = await prisma.admin.findFirst();
    
    if (!adminExists) {
      const admin = await prisma.admin.create({
        data: {
          name: 'System Admin',
          email: 'admin@nodues.com',
          password: 'admin123', // In production, hash this password
        }
      });
      console.log('✅ Admin created:', admin.email);
    } else {
      console.log('✅ Admin already exists');
    }

    // Create departments if they don't exist
    const departments = [
      { department_code: 'CSE', name: 'Computer Science & Engineering', head: 'Dr. John Doe' },
      { department_code: 'ECE', name: 'Electronics & Communication', head: 'Dr. Jane Smith' },
      { department_code: 'ME', name: 'Mechanical Engineering', head: 'Dr. Bob Wilson' },
      { department_code: 'CE', name: 'Civil Engineering', head: 'Dr. Alice Brown' },
      { department_code: 'EE', name: 'Electrical Engineering', head: 'Dr. Charlie Davis' },
      { department_code: 'IT', name: 'Information Technology', head: 'Dr. Eve Johnson' },
    ];

    for (const dept of departments) {
      const exists = await prisma.department.findUnique({
        where: { department_code: dept.department_code }
      });
      
      if (!exists) {
        await prisma.department.create({ data: dept });
        console.log(`✅ Department created: ${dept.name}`);
      }
    }

    // Create hostels if they don't exist
    const hostels = [
      { hostel_no: 'H1', name: 'Hostel 1', warden: 'Mr. Warden 1' },
      { hostel_no: 'H2', name: 'Hostel 2', warden: 'Ms. Warden 2' },
      { hostel_no: 'H3', name: 'Hostel 3', warden: 'Mr. Warden 3' },
    ];

    for (const hostel of hostels) {
      const exists = await prisma.hostel.findUnique({
        where: { hostel_no: hostel.hostel_no }
      });
      
      if (!exists) {
        await prisma.hostel.create({ data: hostel });
        console.log(`✅ Hostel created: ${hostel.name}`);
      }
    }

    // Create central units
    const units = [
      { unit_type: 'Library' },
      { unit_type: 'Accounts' },
      { unit_type: 'Sports' },
      { unit_type: 'Proctor' },
    ];

    for (const unit of units) {
      const exists = await prisma.centralUnit.findUnique({
        where: { unit_type: unit.unit_type }
      });
      
      if (!exists) {
        await prisma.centralUnit.create({ data: unit });
        console.log(`✅ Central Unit created: ${unit.unit_type}`);
      }
    }

    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
