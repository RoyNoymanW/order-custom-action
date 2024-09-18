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
import {httpClient} from "@wix/essentials";
import {getDetailsFromOrder} from "../../../backend/orders";
import {OrderDetails, type Settings} from "../../../types";
import {validateAndEditPhoneNumber} from "../../../utils/phone-number-validator";
import {WindowOpener} from "../../../utils/open-window-for-messages";

// To open your modal, call `openModal` with your modal id.
// e.g.
// import { dashboard } from '@wix/dashboard';
// function MyComponent() {
//   return <button onClick={() => dashboard.openModal('3259acd9-9b12-4f5d-9ace-737a5eb73876')}>Open Modal</button>;
// }

const Modal: FC<{ orderId: string }> = (props) => {
    const orderId = props.orderId;
    console.log('orderId:', orderId);

    const [selectedProduct, setSelectedProduct] = useState('');

    const [productOptionsList, setProductOptionsList] = useState<{id:string,value:string}[]>([]);
    const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(undefined);
    const [contactName, setContactName] = useState<string | null | undefined>(undefined);

    const handleWhatsappMessage = async (contactName: string, productId: string, productName: string, couponCode: string, phoneNumber: string) => {
        const windowOpener = WindowOpener.getInstance();
        const whatsappLink = generateWhatsappLink(
            contactName,
            productId,
            productName,
            couponCode,
            phoneNumber,
        );
        windowOpener.openLink(whatsappLink);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const callGetOrderById = async () => await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/orders?orderId=${orderId}`, {
                    method: 'GET',
                });
                const response = await callGetOrderById()
                const order = await response.json()
                const details =  getDetailsFromOrder(order)
                const mappedOptions = details.orderProducts?.map(productDetails => ({id: productDetails.catalogItemId!, value: productDetails.productName!}))
                setProductOptionsList(mappedOptions!)
                setPhoneNumber(validateAndEditPhoneNumber(details.contactDetails?.phoneNumber))
            } catch (error) {
                dashboard.showToast({
                    message: 'Failed to Update Settings',
                    type: 'error',
                });
            };
        }

        fetchProducts();
    }, []);

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
                    const whatsappResponse = handleWhatsappMessage("Roy",selectedProduct,selectedProduct,"BUYAGAIN2024",phoneNumber)
                    console.log(whatsappResponse)
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
                            onSelect={(option) => setSelectedProduct(option.value)}
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

export default Modal;
