import React, {type FC, useEffect, useState} from 'react';
import {dashboard} from '@wix/dashboard';
import {
    WixDesignSystemProvider,
    Text,
    Box,
    Image,
    Button,
    CustomModalLayout, RadioGroup, Radio, Avatar, InputArea, FormField, Divider, Loader, Dropdown,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import {generateWhatsappLink, generateWhatsappUpsellMessage} from '../../../utils/whatsapp-link-generator';
import {httpClient} from "@wix/essentials";
import {getDetailsFromOrder} from "../../../backend/orders";
import {generateContactName, validateAndEditPhoneNumber} from "../../../utils/phone-number-validator";
import {WindowOpener} from "../../../utils/open-window-for-messages";
import { media } from "@wix/sdk";

const Modal: FC<{ orderId: string }> = (props) => {
    const couponsConstants = [{id:"50",value:"BUYAGAINBIGTIME"}, {id:"10",value: "BUYAGAIN2024"}]
    const orderId = props.orderId;

    const [selectedProduct, setSelectedProduct] = useState<{id:string,value:string,image:string}>({id:"",value: "",image:""});
    const [productOptionsList, setProductOptionsList] = useState<{id:string,value:string,image:string}[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<{id:string,value:string}>({id:couponsConstants[0].id,value: couponsConstants[0].value});
    const [couponsList, setCouponsList] = useState<{id:string,value:string}[]>([]);
    const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(undefined);
    const [contactName, setContactName] = useState<string | null | undefined>(undefined);
    const [controlledWhatsappMessage, setControlledWhatsappMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const controlledMessageForInputArea = selectedProduct.id ?
        controlledWhatsappMessage || generateWhatsappUpsellMessage(contactName, selectedProduct.value, selectedCoupon.value,selectedCoupon.id) :
        '';

    const handleWhatsappMessage = async (contactName: string, productId: string, productName: string, couponCode: string,couponPercentageValue:string, phoneNumber: string, message?: string) => {
        const windowOpener = WindowOpener.getInstance();
        const whatsappLink = generateWhatsappLink(
            contactName,
            productName,
            couponCode,
            couponPercentageValue,
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
                setPhoneNumber(validateAndEditPhoneNumber(details.contactDetails?.phoneNumber))
                setContactName(generateContactName(details.contactDetails?.firstName,details.contactDetails?.lastName))
                setLoading(false);
                setSelectedProduct(mappedOptions![0]);
                const mappedCoupons = couponsConstants.map(c => ({id:c.id,value:c.value}))
                setCouponsList(mappedCoupons)
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
                    const whatsappResponse = handleWhatsappMessage(contactName,selectedProduct.id,selectedProduct.value,selectedCoupon.value,selectedCoupon.id,phoneNumber, controlledMessageForInputArea)
                    console.log(whatsappResponse)
                    dashboard.closeModal();
                }}
                secondaryButtonOnClick={() => dashboard.closeModal()}
                title="Upsell with whatsup"
                subtitle="selcet products to resale"
                content={
                    <Box direction="vertical" align="stretch" margin="medium" gap={4}>
                        <FormField label={"Select an item:"}>
                            <RadioGroup
                                value={selectedProduct.id || ''}
                                onChange={ (prodId) => {
                                    const product = productOptionsList.find(p => {
                                        return p.id === prodId;
                                    });
                                    setSelectedProduct(product);
                                }
                                }
                            >
                                {productOptionsList.map((product) => {
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
                        </FormField>
                        <Divider skin="light" />
                        <Box width={'50%'}>
                        <FormField
                            label={"Select a coupon:"}
                            inputWidth={'50%'}>
                            <Dropdown
                                placeholder="Select a coupon"
                                options={couponsList}
                                selectedId={selectedCoupon.id}
                                onSelect={(option) => {
                                    setSelectedCoupon(option)
                                }}
                            />
                        </FormField>
                        </Box>

                        <Divider skin="light" />
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
