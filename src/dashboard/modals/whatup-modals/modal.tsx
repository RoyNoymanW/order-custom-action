import React, {type FC, useEffect, useState} from 'react';
import {dashboard} from '@wix/dashboard';
import {
    WixDesignSystemProvider,
    Text,
    Box,
    Image,
    Button,
    CustomModalLayout, Dropdown, InputArea, FormField,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import {generateWhatsappLink, generateWhatsappUpsellMessage} from '../../../utils/whatsapp-link-generator';
import {httpClient} from "@wix/essentials";
import {getDetailsFromOrder} from "../../../backend/orders";
import {generateContactName, validateAndEditPhoneNumber} from "../../../utils/phone-number-validator";
import {WindowOpener} from "../../../utils/open-window-for-messages";

const Modal: FC<{ orderId: string }> = (props) => {
    const orderId = props.orderId;
    console.log('orderId:', orderId);

    const [selectedProduct, setSelectedProduct] = useState<{id:string,value:string}>({id:"",value: ""});
    console.log("initial: ", selectedProduct)
    const [productOptionsList, setProductOptionsList] = useState<{id:string,value:string}[]>([]);
    const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(undefined);
    const [contactName, setContactName] = useState<string | null | undefined>(undefined);
    const [controlledWhatsappMessage, setControlledWhatsappMessage] = useState('');

    const controlledMessageForInputArea = selectedProduct.id ?
        controlledWhatsappMessage || generateWhatsappUpsellMessage(contactName, selectedProduct.value, "BUYAGAIN2024") :
        '';

    const handleWhatsappMessage = async (contactName: string, productId: string, productName: string, couponCode: string, phoneNumber: string, message?: string) => {
        const windowOpener = WindowOpener.getInstance();
        const whatsappLink = generateWhatsappLink(
            contactName,
            productName,
            couponCode,
            phoneNumber,
            message
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
                setContactName(generateContactName(details.contactDetails?.firstName,details.contactDetails?.lastName))
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
                primaryButtonText="Send Message"
                secondaryButtonText="Cancel"
                onCloseButtonClick={() => dashboard.closeModal()}
                primaryButtonOnClick={() => {
                    console.log('Found selected product ???:', selectedProduct);
                    const whatsappResponse = handleWhatsappMessage(contactName,selectedProduct.id,selectedProduct.value,"BUYAGAIN2024",phoneNumber, controlledMessageForInputArea)
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
                            selectedId={selectedProduct.id}
                            onSelect={
                                (option:{id:string,value:string}) => {
                                    console.log("option:" ,option)
                                    setSelectedProduct(option)
                                }
                            }
                        />
                        <Box marginTop="medium" align="center">
                            <FormField label="WhatsApp message to the user">
                                <InputArea
                                    placeholder=""
                                    rows={6}
                                    maxLength={500}
                                    hasCounter
                                    resizable
                                    value={controlledMessageForInputArea}
                                    onChange={(e) => setControlledWhatsappMessage(e.target.value)}
                                />
                            </FormField>
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
