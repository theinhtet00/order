import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get_all_orders')
  async getAll(): Promise<object> {
    return await this.appService.getAll();
  }

  @MessagePattern('get_one_order')
  async getOne(id: string): Promise<object> {
    return await this.appService.getOne(parseInt(id));
  }

  @MessagePattern('store_order')
  async createOrder(body: CreateOrderDto): Promise<object> {
    return this.appService.store(body);
  }

  @EventPattern('payment_done')
  async paymentAccept(body) {
    return this.appService.paymentAccept(body.id);
  }

  @EventPattern('payment_reject')
  async paymentReject(body) {
    return this.appService.paymentReject(body.id);
  }

  @EventPattern('deliver_product')
  async deliverProduct(body) {
    return this.appService.deliverProduct(body.id);
  }
}
