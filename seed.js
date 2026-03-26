import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const seedUsers = async () => {
  try {
    console.log('Clearing existing users...');
    await pool.query('DELETE FROM users');

    console.log('Generating seed data...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = [
      { name: 'Alex Reader', email: 'alex@example.com', password },
      { name: 'Sam Studious', email: 'sam@example.com', password },
      { name: 'Jordan Focus', email: 'jordan@example.com', password }
    ];

    console.log('Inserting users...');
    for (const user of users) {
      await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        [user.name, user.email, user.password]
      );
      console.log(`Added user: ${user.name} (${user.email})`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('You can now log in using any of these emails with the password: password123');
    
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    await pool.end();
  }
};

seedUsers();
