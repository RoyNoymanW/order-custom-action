
export const generateWhatsappLink = (contactName: string, productId: string, productName: string, couponCode: string, phone: string) => {
    const message: string = generateWhatsappUpsellMessage(contactName, productId, productName, couponCode)
    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    console.log(whatsappLink)
    return whatsappLink
}

const generateProductLink = (productName: string) => {
    const productRoute = productName.split(' ').join('-').toLowerCase();
    return `https://etaybarzilay.wixstudio.io/order-custom-actions/product-page/${productRoute}`;
}

const generateWhatsappUpsellMessage = (contactName: string, productId: string, productName: string, couponCode: string) => {
    let emoji = '😊';
    return `*Hey ${contactName}!*\n
Hope you're still enjoying your ${productName}! ${emoji} Need a new one?\n
Grab it now and get *10% OFF* with the code *${couponCode}*. Just tap here to order: ${generateProductLink(productName)}.\n
Don't miss out!`;
}


