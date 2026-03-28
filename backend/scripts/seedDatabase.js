const { resetDatabase } = require('./databaseManager');

console.log('Starting database reset and seed process...');

resetDatabase()
  .then((data) => {
    console.log('Database successfully reset and seeded.');
    console.log('');
    console.log('Created data summary:');
    console.log(`- Academic Years: ${data.academicYears.length}`);
    console.log(`- Users: ${data.users.length}`);
    console.log(`- Teachers: ${data.teachers.length}`);
    console.log(`- Subjects: ${data.subjects.length}`);
    console.log(`- Classes: ${data.classes.length}`);
    console.log(`- Students: ${data.students.length}`);
    console.log(`- Teaching Assignments: ${data.teachingAssignments.length}`);
    console.log(`- Attendance Sessions: ${data.attendanceSessions.length}`);
    console.log('');
    console.log('Login credentials:');
    console.log(`- Admin: admin / ${data.demoPassword}`);
    console.log(`- Teachers: GV001, GV002, GV003 / ${data.demoPassword}`);
    console.log(`- Students: HS001..HS008, HS999 / ${data.demoPassword}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during database reset:', error);
    process.exit(1);
  });

