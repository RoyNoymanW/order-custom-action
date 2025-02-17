const generateProductLink = (productName: string) => {
    const productRoute = productName.replaceAll(' ', '-').toLowerCase();

    // This is a sample URL. Replace it with your own site URL.
    // TODO: dynamically get site URL
    const siteUrl = "https://etaybarzilay.wixstudio.io/order-custom-actions";
    return `${siteUrl}/product-page/${productRoute}`;
};

export const generateWhatsappLink = (contactName: string, productName: string, phone: string, controlledMessage?: string) => {
    let message = controlledMessage || generateWhatsappMessage(contactName, productName);
    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


    return whatsappLink;
};

export const generateWhatsappMessage = (contactName: string, productName: string) => {
    return `
        *Hey ${contactName}!*\n
        Hope you're still enjoying your ${productName}! =]\n Need a new one?\n
        Grab it now. Just tap here to order: ${generateProductLink(productName)}\n
        Don't miss out!
    `;
};


