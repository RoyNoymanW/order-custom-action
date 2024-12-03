const addCountryCodeIfMissing = (phoneNumber:string): string => {
    // Remove all dashes from the phone number
    const cleanPhoneNumber = phoneNumber.replace(/-/g, '');
    if (cleanPhoneNumber.startsWith('972')) return cleanPhoneNumber;
    return `972${cleanPhoneNumber}`;
};

export const validateAndEditPhoneNumber = (phoneNumber?: string) => {
    return phoneNumber ? addCountryCodeIfMissing(phoneNumber) : undefined;
}

export const generateContactName = (firstName?: string, lastName?: string) => {
    return [firstName, lastName].filter(Boolean).join(' ') || 'dear user';
}