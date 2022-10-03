import { Offer } from './offer';

export interface Product extends Offer {
  name: string;
  max_price: number;
  features?: string;
  category?: string;
  chatId?: string;
  quantity?: number;
}
