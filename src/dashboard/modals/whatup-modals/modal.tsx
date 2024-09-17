import React, {type FC, useEffect, useState} from 'react';
import {dashboard} from '@wix/dashboard';
import {
    WixDesignSystemProvider,
    Text,
    Box,
    Image,
    Button,
    CustomModalLayout, Dropdown,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import {generateWhatsappLink} from '../../../utils/whatsapp-link-generator';


import {width, height} from './modal.json';
import {httpClient} from "@wix/essentials";
import {getDetailsFromOrder} from "../../../backend/orders";
import {OrderDetails, type Settings} from "../../../types";

// To open your modal, call `openModal` with your modal id.
// e.g.
// import { dashboard } from '@wix/dashboard';
// function MyComponent() {
//   return <button onClick={() => dashboard.openModal('3259acd9-9b12-4f5d-9ace-737a5eb73876')}>Open Modal</button>;
// }

const DEFAULT_PHONE_NUMBER = '972525555555';

const Modal: FC<{ orderId: string }> = (props) => {
    const orderId = props.orderId;
    console.log('orderId:', orderId);

    const [selectedProduct, setSelectedProduct] = useState('');

    const [productOptionsList, setProductOptionsList] = useState<{id:string,value:string}[]>([]);
    const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(undefined);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const callGetOrderById = async () => await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/orders?orderId=${orderId}`, {
                    method: 'GET',
                });
                const response = await callGetOrderById()
                const order = await response.json()
                const details =  getDetailsFromOrder(order)
                const mappedOptions = details.orderProducts?.map(productName => ({id: productName!, value: productName!}))
                const phoneNumberWithCountry =
                setProductOptionsList(mappedOptions!)
                setPhoneNumber(addCountryCodeIfMissing(details.phoneNumber))
                // setPhoneNumber("972527704448")
            } catch (error) {
                dashboard.showToast({
                    message: 'Failed to Update Settings',
                    type: 'error',
                });
            };
        }

        fetchProducts();
    }, []);

    const productOptions = [
        {id: 'product1', value: 'Product 1'},
        {id: 'product2', value: 'Product 2'},
        {id: 'product3', value: 'Product 3'},
    ];

    return (
        <WixDesignSystemProvider features={{newColorsBranding: true}}>
            <CustomModalLayout
                // width={width}
                // maxHeight={height}
                primaryButtonText="Send Message"
                secondaryButtonText="Cancel"
                onCloseButtonClick={() => dashboard.closeModal()}
                primaryButtonOnClick={() => {
                    console.log('Selected product:', selectedProduct);
                    console.log('Found selected product ???:', selectedProduct);
                    const whatsappMessage = generateWhatsappLink("Roy",selectedProduct,selectedProduct,"50%SPECIALOFFER",phoneNumber)
                    console.log(whatsappMessage)
                    dashboard.closeModal();
                }}
                secondaryButtonOnClick={() => dashboard.closeModal()}
                title="Upsell with whatsup"
                subtitle="selcet products to resale"
                content={
                    <Box direction="vertical" align="stretch" margin="medium">
                        <Dropdown
                            placeholder="Select a product"
                            options={productOptionsList}
                            selectedId={selectedProduct}
                            onSelect={(option) => setSelectedProduct(option.id)}
                        />
                        <Box marginTop="medium" align="center">
                            <Text>Wix CLI Modal</Text>
                        </Box>
                    </Box>
                }
            />
        </WixDesignSystemProvider>
    );
};


const renderOrder = async (orderId: string) => {
    try {
        const callGetOrderById = async () => await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/orders?orderId=${orderId}`, {
            method: 'GET',
        });
        const response = await callGetOrderById()
        const order = await response.json()
        return getDetailsFromOrder(order)
    } catch (error) {
        dashboard.showToast({
            message: 'Failed to Update Settings',
            type: 'error',
        });
    };
}

const addCountryCodeIfMissing = (phoneNumber: string | null | undefined): string => {
    console.log("phoneNumber: ", phoneNumber)
    if (!phoneNumber) return DEFAULT_PHONE_NUMBER;

    // Remove all dashes from the phone number
    const cleanPhoneNumber = phoneNumber.replace(/-/g, '');
    if (cleanPhoneNumber.startsWith('972')) return cleanPhoneNumber;
    return `972${cleanPhoneNumber}`;
};

export default Modal;
