import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  @Render('wishlist.hbs')
  async root(@Param() params) {
    const products = await this.appService.getProducts(params.id);
    const user = await this.appService.getUser(params.id);
    return { wishlist: products, user };
  }
}
