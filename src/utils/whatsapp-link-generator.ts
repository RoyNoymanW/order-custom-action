
export const generateWhatsappLink = (contactName: string, productName: string, couponCode: string, phone: string, controlledMessage?: string) => {
    let message = controlledMessage || generateWhatsappUpsellMessage(contactName, productName, couponCode);
    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    console.log(whatsappLink)
    return whatsappLink
}

const generateProductLink = (productName: string) => {
    const productRoute = productName.split(' ').join('-').toLowerCase();
    return `https://etaybarzilay.wixstudio.io/order-custom-actions/product-page/${productRoute}`;
}

export const generateWhatsappUpsellMessage = (contactName: string, productName: string, couponCode: string) => {
    return `*Hey ${contactName}!*\n
Hope you're still enjoying your ${productName}! =]\n Need a new one?\n
Grab it now and get *10% OFF* with the code *${couponCode}*. Just tap here to order: ${generateProductLink(productName)}.\n
Don't miss out!`;
}


