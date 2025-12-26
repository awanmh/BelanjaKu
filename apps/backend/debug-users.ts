import db from '../src/database/models';

async function checkUsers() {
    try {
        const users = await db.User.findAll({
            attributes: ['id', 'email', 'role', 'fullName'],
        });

        console.log('--- EXISTING USERS ---');
        users.forEach(u => {
            console.log(`Email: ${u.email} | Role: ${u.role} | Name: ${u.fullName}`);
        });
        console.log('----------------------');
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        await db.sequelize.close(); // Close connection
    }
}

checkUsers();
