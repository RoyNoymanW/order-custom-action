import React, {type FC, useEffect, useState} from 'react';
import {dashboard} from '@wix/dashboard';
import {
    WixDesignSystemProvider,
    Text,
    Box,
    Image,
    Button,
    CustomModalLayout, RadioGroup, Radio, Avatar, InputArea, FormField, Divider, Loader,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import {generateWhatsappLink, generateWhatsappUpsellMessage} from '../../../utils/whatsapp-link-generator';
import {httpClient} from "@wix/essentials";
import {getDetailsFromOrder} from "../../../backend/orders";
import {generateContactName, validateAndEditPhoneNumber} from "../../../utils/phone-number-validator";
import {WindowOpener} from "../../../utils/open-window-for-messages";
import { media } from "@wix/sdk";

const Modal: FC<{ orderId: string }> = (props) => {
    const orderId = props.orderId;
    console.log('orderId:', orderId);

    const [selectedProduct, setSelectedProduct] = useState<{id:string,value:string,image:string}>({id:"",value: "",image:""});
    console.log("initial: ", selectedProduct)
    const [productOptionsList, setProductOptionsList] = useState<{id:string,value:string,image:string}[]>([]);
    const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(undefined);
    const [contactName, setContactName] = useState<string | null | undefined>(undefined);
    const [controlledWhatsappMessage, setControlledWhatsappMessage] = useState('');
    const [loading, setLoading] = useState(true);

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
            setLoading(true);
            try {
                const callGetOrderById = async () => await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/orders?orderId=${orderId}`, {
                    method: 'GET',
                });
                const response = await callGetOrderById()
                const order = await response.json()
                const details =  getDetailsFromOrder(order)
                console.log("details.orderProducts useEffect: ", details.orderProducts)
                const mappedOptions = details.orderProducts?.map(productDetails => ({id: productDetails.catalogItemId!, value: productDetails.productName!,image:productDetails.image!}))
                setProductOptionsList(mappedOptions!)
                setPhoneNumber(validateAndEditPhoneNumber(details.contactDetails?.phoneNumber))
                setContactName(generateContactName(details.contactDetails?.firstName,details.contactDetails?.lastName))
                setLoading(false);
                setSelectedProduct(mappedOptions![0]);
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
                        <Box marginBottom='small'>
                            <Text weight='thin' size="small">Select an item:</Text>
                        </Box>
                        <RadioGroup
                            value={selectedProduct.id || ''}
                            onChange={ (prodId) => {
                                    const product = productOptionsList.find(p => {
                                        console.log('prodId', prodId);
                                        console.log('p.id', p.id);
                                        return p.id === prodId;
                                    });
                                    console.log("product inside on change", product)
                                    setSelectedProduct(product);
                                }
                            }
                        >
                            {productOptionsList.map((product) => {
                                console.log("product is: ",product)
                                return (<RadioGroup.Radio value={product.id}>
                                    <Box gap={2} verticalAlign="middle">
                                        <Image
                                            width={'45px'}
                                            height={'45px'}
                                            src={getImageFromWixMedia(product.image)} />
                                        <Box direction="vertical">
                                            <Text weight="normal">{product.value}</Text>
                                        </Box>
                                    </Box>
                                </RadioGroup.Radio>)
                                })}
                        </RadioGroup>
                        <Box marginTop={'medium'}>
                            <Divider skin="light" />
                        </Box>
                        <Box marginTop="medium" align="center">
                            <FormField label="WhatsApp message to the user">
                                <InputArea
                                    minHeight={'270px'}
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

const getImageFromWixMedia = (productImage:string) => {
    return media.getImageUrl(productImage).url;
}
export default Modal;
