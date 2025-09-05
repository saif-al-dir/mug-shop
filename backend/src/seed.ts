import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  const products = [
    {
      title: 'Coffee Mugs',
      image: 'https://static.vecteezy.com/system/resources/previews/037/045/901/non_2x/ai-generated-black-coffee-mug-isolated-free-png.png',
      additionalImages: [
        'https://static.vecteezy.com/system/resources/previews/049/662/792/non_2x/a-red-coffee-mug-isolated-on-transparent-background-free-png.png',
        'https://static.vecteezy.com/system/resources/previews/051/803/213/non_2x/realistic-empty-yellow-coffee-mug-on-transparent-background-free-png.png',
      ],
      price: 50.0,
      description: 'A very cool mugs made of 100% ceramic.',
    },
    {
      title: 'White Coffee Mug',
      image: 'https://static.vecteezy.com/system/resources/previews/029/283/030/original/coffee-coffee-cup-coffee-cup-coffee-cup-clipart-restaurant-coffee-cup-transparent-background-ai-generative-free-png.png',
      additionalImages: [],
      price: 30.0,
      description: 'A ceramic coffee mug with a cool print.',
    },
    {
      title: 'Green Coffee Mug',
      image: 'https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-green-coffee-cup-png-illustration-png-image_11580402.png',
      additionalImages: [],
      price: 20.0,
      description: 'A beautiful mug for your room.',
    },
  ];

  for (const product of products) {
    await productsService.create(product);
  }

  console.log('Seeding complete');
  await app.close();
}

bootstrap();