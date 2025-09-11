import 'dotenv/config'; 
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import * as bcrypt from 'bcryptjs';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Product],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const productRepo = AppDataSource.getRepository(Product);

  // ✅ Create admin user if not exists
  const adminExists = await userRepo.findOne({ where: { username: 'admin' } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('yourAdminPasswordForMug', 10);
    const admin = userRepo.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });
    await userRepo.save(admin);
    console.log(
      '✅ Admin user created: username=admin, password=yourAdminPasswordForMug',
    );
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // ✅ Insert sample products if none exist
  const count = await productRepo.count();
  if (count === 0) {
    const sampleProducts = [
      {
        title: 'Sample Mug',
        image:
          'https://static.vecteezy.com/system/resources/previews/037/045/891/non_2x/ai-generated-black-coffee-mug-isolated-free-png.png',
        additionalImages: ['https://via.placeholder.com/100'],
        price: 19.99,
        description: 'A very cool mugs made of 100% ceramic.',
      },
      {
        title: 'Sample T-Shirt',
        image:
          'https://static.vecteezy.com/system/resources/previews/037/045/891/non_2x/ai-generated-black-coffee-mug-isolated-free-png.png',
        additionalImages: [],
        price: 19.99,
        description: 'A comfy sample t-shirt',
      },
    ];
    await productRepo.save(sampleProducts);
    console.log('✅ Sample products inserted');
  } else {
    console.log('ℹ️ Products already exist');
  }

  await AppDataSource.destroy();
}

seed()
  .then(() => console.log('🌱 Seeding complete'))
  .catch((err) => console.error(err));
