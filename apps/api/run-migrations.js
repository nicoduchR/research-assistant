const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/research_assistant_dev',
  entities: [path.resolve(__dirname, 'dist/entities/*.entity.js')],
  migrations: [path.resolve(__dirname, 'dist/migrations/*[0-9]*-*.js')],
  synchronize: false,
  logging: true,
});

(async () => {
  try {
    console.log('🔄 Initializing data source...');
    await AppDataSource.initialize();

    console.log('🔄 Running migrations...');
    const migrations = await AppDataSource.runMigrations();

    if (migrations.length === 0) {
      console.log('✅ No pending migrations');
    } else {
      console.log(`✅ ${migrations.length} migration(s) executed successfully:`);
      migrations.forEach(m => console.log(`   - ${m.name}`));
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
})();
