export function priceToFloat(price) {
    if (price.includes('.') && price.includes(','))
        price = price.replace('.', '').replace(',', '.');
    else if (price.includes(','))
        price = price.replace(',', '.');
    return price
}