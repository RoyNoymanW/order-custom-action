import React, { type FC, useState } from 'react';
import { dashboard } from '@wix/dashboard';
import {
    WixDesignSystemProvider,
    Text,
    Box,
    CustomModalLayout, Dropdown,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { width, height } from './modal.json';

// To open your modal, call `openModal` with your modal id.
// e.g.
// import { dashboard } from '@wix/dashboard';
// function MyComponent() {
//   return <button onClick={() => dashboard.openModal('3259acd9-9b12-4f5d-9ace-737a5eb73876')}>Open Modal</button>;
// }
const Modal: FC<{orderId: string}> = (props) => {

    const orderId = props.orderId;
    console.log('orderId:', orderId);

    const [selectedProduct, setSelectedProduct] = useState('');

    const productOptions = [
        { id: 'product1', value: 'Product 1' },
        { id: 'product2', value: 'Product 2' },
        { id: 'product3', value: 'Product 3' },
    ];

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <CustomModalLayout
        // width={width}
        // maxHeight={height}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onCloseButtonClick={() => dashboard.closeModal()}
        primaryButtonOnClick={() => {
            console.log('Selected product:', selectedProduct);
            dashboard.closeModal();
        }}        secondaryButtonOnClick={() => dashboard.closeModal()}
        title="Upsell with whatsup"
        subtitle="selcet products to resale"
        content={
            <Box direction="vertical" align="stretch" margin="medium">
              <Dropdown
                  placeholder="Select a product"
                  options={productOptions}
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

export default Modal;
