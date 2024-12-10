import React, { type FC, useEffect, useState } from 'react';
import { dashboard } from '@wix/dashboard';
import { httpClient } from "@wix/essentials";
import { media } from "@wix/sdk";
import { orders } from '@wix/ecom';
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
import { height, width, title } from './modal.json';
import { getContactNameFromOrder, getPhoneNumberFromOrder } from "../../../utils/get-details-from-order";
import { generateWhatsappLink, generateWhatsappUpsellMessage } from '../../../utils/whatsapp-link-generator';

type Product = {
    id: string;
    value: string;
    image: string;
};

const Modal: FC<{ orderId: string }> = ({ orderId }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [productOptionsList, setProductOptionsList] = useState<Product[]>([]);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [contactName, setContactName] = useState<string>('');
    const [controlledWhatsappMessage, setControlledWhatsappMessage] = useState<string>(
        selectedProduct ? generateWhatsappUpsellMessage(contactName, selectedProduct.value) : ''
    );

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/order?orderId=${orderId}`);
                const order: orders.Order = await response.json();
                const mappedOptions = (order.lineItems ?? []).map(lineItem => {
                    return {
                        id: lineItem.catalogReference?.catalogItemId ?? '',
                        value: lineItem.productName?.original ?? '',
                        image: lineItem.image ?? '',
                    };
                });

                setProductOptionsList(mappedOptions);
                setPhoneNumber(getPhoneNumberFromOrder(order));
                setContactName(getContactNameFromOrder(order));
                setSelectedProduct(mappedOptions?.[0]);
                setLoading(false);
            } catch (error) {
                dashboard.showToast({
                    message: 'Failed to Update Settings',
                    type: 'error',
                });
            };
        };

        fetchProducts();
    }, []);

    return (
        <WixDesignSystemProvider features={{ newColorsBranding: true }}>
            <CustomModalLayout
                title={title}
                subtitle="select products to resale"
                width={width}
                maxHeight={height}
                onCloseButtonClick={() => dashboard.closeModal()}
                secondaryButtonText="Cancel"
                secondaryButtonOnClick={() => dashboard.closeModal()}
                primaryButtonText="Send Message"
                primaryButtonProps={{ disabled: !phoneNumber }}
                primaryButtonOnClick={() => {
                    dashboard.closeModal();

                    if (selectedProduct) {
                        const whatsappLink = generateWhatsappLink(
                            contactName,
                            selectedProduct.value,
                            phoneNumber,
                            controlledWhatsappMessage
                        );

                        window.open(whatsappLink);
                    };
                }}
                content={
                    <Box direction="vertical" gap={4}>
                        {loading ? <Loader /> : (
                            <>
                                {!phoneNumber && (
                                    <SectionHelper>
                                        Please add a phone number to the contact to send a message
                                    </SectionHelper>
                                )}
                                <FormField label={"Select an item"}>
                                    <RadioGroup
                                        key={selectedProduct?.id}
                                        value={selectedProduct?.id}
                                        onChange={(id) => {
                                            const product = productOptionsList.find(product => {
                                                return product.id === id;
                                            });

                                            if (product) {
                                                setSelectedProduct(product);
                                            };
                                        }}
                                    >
                                        {productOptionsList.map((product) => {
                                            return (
                                                <RadioGroup.Radio
                                                    key={product.id}
                                                    value={product.id}
                                                >
                                                    <Box gap={2} verticalAlign="middle">
                                                        <Image
                                                            width={'45px'}
                                                            height={'45px'}
                                                            src={media.getImageUrl(product.image).url}
                                                        />
                                                        <Text weight="normal">{product.value}</Text>
                                                    </Box>
                                                </RadioGroup.Radio>
                                            )
                                        })}
                                    </RadioGroup>
                                </FormField>
                                <Divider skin="light" />
                                <FormField label="WhatsApp message to the user">
                                    <InputArea
                                        minHeight={'270px'}
                                        rows={6}
                                        maxLength={500}
                                        hasCounter
                                        resizable
                                        value={controlledWhatsappMessage}
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

export default Modal;
