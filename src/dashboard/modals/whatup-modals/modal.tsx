import React, {type FC, useEffect, useState} from 'react';
import {dashboard} from '@wix/dashboard';
import {
    WixDesignSystemProvider,
    Text,
    Box,
    Image,
    CustomModalLayout,
    RadioGroup,
    InputArea,
    FormField,
    Divider,
    Loader,
    SectionHelper,
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

    const [selectedProduct, setSelectedProduct] = useState<{id:string,value:string,image:string}>({id:"",value: "",image:""});
    const [productOptionsList, setProductOptionsList] = useState<{id:string,value:string,image:string}[]>([]);
    const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(undefined);
    const [contactName, setContactName] = useState<string | null | undefined>(undefined);
    const [controlledWhatsappMessage, setControlledWhatsappMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const controlledMessageForInputArea = selectedProduct.id ?
        controlledWhatsappMessage || generateWhatsappUpsellMessage(contactName!, selectedProduct.value) : '';

    const handleWhatsappMessage = async (contactName: string, productName: string, phoneNumber: string, message?: string) => {
        const windowOpener = WindowOpener.getInstance();
        const whatsappLink = generateWhatsappLink(
            contactName,
            productName,
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
                const mappedOptions = details.orderProducts?.map(productDetails => ({id: productDetails.catalogItemId!, value: productDetails.productName!,image:productDetails.image!}))
                setProductOptionsList(mappedOptions!)
                setPhoneNumber(validateAndEditPhoneNumber(details.contactDetails?.phoneNumber as string));
                setContactName(generateContactName(details.contactDetails?.firstName as string, details.contactDetails?.lastName as string))
                setSelectedProduct(mappedOptions![0]);
                setLoading(false);
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
                primaryButtonProps={{disabled: !phoneNumber}}
                secondaryButtonText="Cancel"
                onCloseButtonClick={() => dashboard.closeModal()}
                primaryButtonOnClick={() => {
                    const whatsappResponse = handleWhatsappMessage(contactName!, selectedProduct.value, phoneNumber!, controlledMessageForInputArea)
                    console.log(whatsappResponse)
                    dashboard.closeModal();
                }}
                secondaryButtonOnClick={() => dashboard.closeModal()}
                title="Upsell with whatsup"
                subtitle="select products to resale"
                content={
                    <Box direction="vertical" gap={4}>
                        {loading ? <Loader size="medium"></Loader> : (
                            <>
                                {!phoneNumber && (
                                    <SectionHelper>
                                        Please add a phone number to the contact to send a message
                                    </SectionHelper>
                                )}
                                <FormField label={"Select an item:"}>
                                    <RadioGroup
                                        value={selectedProduct.id || ''}
                                        key={selectedProduct.id}
                                        onChange={(prodId) => {
                                            const product = productOptionsList.find(p => {
                                                return p.id === prodId;
                                            });
                                            setSelectedProduct(product!);
                                        }
                                        }
                                    >
                                        {productOptionsList.map((product) => {
                                            return (<RadioGroup.Radio value={product.id}>
                                                <Box gap={2} verticalAlign="middle">
                                                    <Image
                                                        width={'45px'}
                                                        height={'45px'}
                                                        src={getImageFromWixMedia(product.image)}/>
                                                    <Box direction="vertical">
                                                        <Text weight="normal">{product.value}</Text>
                                                    </Box>
                                                </Box>
                                            </RadioGroup.Radio>)
                                        })}
                                    </RadioGroup>
                                </FormField>
                                <Divider skin="light"/>
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
                            </>
                        )}
                    </Box>
                }
            />
        </WixDesignSystemProvider>
    );
};

const getImageFromWixMedia = (productImage:string) => {
    return media.getImageUrl(productImage).url;
}
export default Modal;
