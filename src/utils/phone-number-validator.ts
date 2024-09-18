const DEFAULT_PHONE_NUMBER:string = '972525555555';

const addCountryCodeIfMissing = (phoneNumber:string): string => {
    // Remove all dashes from the phone number
    const cleanPhoneNumber = phoneNumber.replace(/-/g, '');
    if (cleanPhoneNumber.startsWith('972')) return cleanPhoneNumber;
    return `972${cleanPhoneNumber}`;
};

export const validateAndEditPhoneNumber = (phoneNumber: string | null | undefined) => {
    console.log("phoneNumber: ", phoneNumber);
    if (!phoneNumber) return DEFAULT_PHONE_NUMBER;
    return addCountryCodeIfMissing(phoneNumber!);
}