import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/history/:id')
  @Render('pricehistory.hbs')
  async history(@Param() params) {
    const history = await this.appService.getPriceHistory(params.id);
    return { history, productName:params.id };
  }
  @Get(':id/offers')
  @Render('wishlist.hbs')
  async root(@Param() params) {
    const products = await this.appService.getProducts(params.id);
    const user = await this.appService.getUser(params.id);
    return { wishlist: products, user };
  }
  @Get(':id/groceries')
  @Render('groceries.hbs')
  async groceries(@Param() params) {
    const groceries = await this.appService.getGroceries(params.id);
    const user = await this.appService.getUser(params.id);

    return { groceries, user };
  }
  @Get('/')
  @Render('index.hbs')
  async index() {
    return '';
  }
}
