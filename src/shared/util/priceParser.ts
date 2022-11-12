export function priceToFloat(price) {
    if (price.includes('.') && price(','))
        price = price.replace('.', '').replace(',', '.');
    else if (price.includes(','))
        price = price.replace(',', '.');
    return price
}