
export const generateWhatsappLink = (contactName: string, productId: string, productName: string, couponCode: string, phone: string, productLink: string) => {
    const message: string = generateWhatsappUpsellMessage(contactName, productId, productName, couponCode, productLink)
    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    console.log(whatsappLink)
    return whatsappLink
}

const generateProductLink = (productId: string) => {
    return 'https://www.example.com/products/' + productId;
}

const generateWhatsappUpsellMessage = (contactName: string, productId: string, productName: string, couponCode: string, productLink: string) => {
    return `Hey ${contactName}!\nHope you're still enjoying your ${productName}! :blush: Need a new one?\n 
    Grab it now and get 10% OFF with the code ${couponCode}. Just tap here to order: ${productLink}.
    Don't miss out!
}
