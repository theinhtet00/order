import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderEntity } from './order.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @Inject('Payment_Service')
    private readonly paymentClient: ClientProxy,
    @Inject('Product_Service')
    private readonly productClient: ClientProxy,
  ) {}

  async getAll(): Promise<object> {
    const orders = await this.orderRepository.find();
    return orders;
  }

  async getOne(id: number): Promise<object> {
    const order = await this.orderRepository.findOne(id);
    return order;
  }

  async store(body: CreateOrderDto): Promise<object> {
    const create_order = this.orderRepository.create(body);
    const order = await this.orderRepository.save(create_order);
    this.paymentClient.emit('order_created', order);

    return order;
  }

  async update(id: number, body: CreateOrderDto): Promise<object> {
    const order = await this.orderRepository.findOne(id);
    if (order) {
      order.item = body.item;
      order.quantity = body.quantity;
      return await this.orderRepository.save(order);
    } else {
      throw new NotFoundException('order not found');
    }
  }

  async paymentAccept(id: number) {
    const order = await this.orderRepository.findOne(id);
    order.status = 'Accepted';
    await this.orderRepository.save(order);
    this.productClient.emit('order_created', order);
  }

  async paymentReject(id: number) {
    const order = await this.orderRepository.findOne(id);
    order.status = 'Canceled';
    await this.orderRepository.save(order);
  }

  async deliverProduct(id: number) {
    const order = await this.orderRepository.findOne(id);
    order.status = 'Delivered';
    await this.orderRepository.save(order);
  }
}
