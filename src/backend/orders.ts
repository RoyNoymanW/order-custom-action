import {orders} from '@wix/ecom';
import {ContactDetails, OrderDetails, ProductsDetails} from "../types";

export async function getOrder(_id: string): Promise<orders.Order> {
    //https://dev.wix.com/docs/sdk/backend-modules/ecom/orders/get-order
    const order = await orders.getOrder(_id);
    return order;
}

export function getBuyerContactDetails(order: orders.Order): ContactDetails | null {
    if (order.billingInfo) return ({
        phoneNumber: order.billingInfo?.contactDetails?.phone,
        firstName: order.billingInfo?.contactDetails?.firstName,
        lastName: order.billingInfo?.contactDetails?.lastName
    });
    else if (order.shippingInfo) return ({
        phoneNumber: order.recipientInfo?.contactDetails?.phone,
        firstName: order.recipientInfo?.contactDetails?.firstName,
        lastName: order.recipientInfo?.contactDetails?.lastName
    });
    else {
        console.log(`No phone number found in order ${JSON.stringify(order)}`);
        return null;
    }
}

export function getDetailsFromOrder(order: orders.Order): OrderDetails {
    const contactDetails = getBuyerContactDetails(order);
    const orderProducts = order.lineItems?.map(lineItem => (
        {
            productName: lineItem.productName?.original,
            image: lineItem.image,
            catalogItemId: lineItem.catalogReference?.catalogItemId
        })
    );
    return {contactDetails, orderProducts}
}

export function getBuyerLanguage(order: orders.Order): string | null | undefined {
    return order.buyerLanguage
}
