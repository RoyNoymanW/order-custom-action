import { orders } from '@wix/ecom';

export function getPhoneNumberFromOrder(order: orders.Order) {
    const phoneNumber = order.billingInfo?.contactDetails?.phone ?? order.recipientInfo?.contactDetails?.phone;
    if (!phoneNumber) return '';

    // Remove all dashes from the phone number
    const sanitizedPhoneNumber = phoneNumber.replaceAll('-', '');
    return sanitizedPhoneNumber.startsWith('972') ? sanitizedPhoneNumber : `972${sanitizedPhoneNumber}`;
};

export function getContactNameFromOrder(order: orders.Order) {
    const firstName = order.billingInfo?.contactDetails?.firstName ?? order.recipientInfo?.contactDetails?.firstName;
    const lastName = order.billingInfo?.contactDetails?.lastName ?? order.recipientInfo?.contactDetails?.lastName;

    return [firstName, lastName].filter(Boolean).join(' ') || 'dear user';
};