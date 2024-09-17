
export const generateWhatsappLink = (contactName: string, productId: string, productName: string, couponCode: string, phone: string) => {
    const message: string = generateWhatsappUpsellMessage(contactName, productId, productName, couponCode)
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const generateProductLink = (productId: string) => {
    return 'https://www.example.com/products/' + productId;
}

const generateWhatsappUpsellMessage = (contactName: string, productId: string, productName: string, couponCode: string) => {
    return `Hi ${contactName}, we want to offer you an upsell for ${productName} for 50% off with this coupon code: ${couponCode}. 
    Click here to purchase: ${generateProductLink(productId)}`;
}
