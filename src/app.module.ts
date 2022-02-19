import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderEntity } from './order.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Payment_Service',
        transport: Transport.TCP,
        options: {
          port: 3001,
        },
      },
      {
        name: 'Product_Service',
        transport: Transport.TCP,
        options: {
          port: 3002,
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: '1437',
      database: 'order_management',
      entities: [OrderEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([OrderEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
