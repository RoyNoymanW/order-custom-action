# Order custom actions template

This project was bootstrapped with [Create Wix App](https://www.npmjs.com/package/@wix/create-app).  
Read more about it in the [Wix CLI for Apps
 documentation](https://dev.wix.com/docs/build-apps/developer-tools/cli/get-started/about-the-wix-cli-for-apps).

This template demonstrate the usage of the Ecom orderes SDK, the addition of a menu item to the Order page in the Business Manager and an integration with WhatsUp web.

### Using the Ecom orders SDK
The Ecom orders SDK is a powerful tool that allows you to interact with the orders in the store.
<br>In this template we use the SDK to get the order details and the order items.
//https://dev.wix.com/docs/sdk/backend-modules/ecom/orders/get-order

### Adding a menu item to the Order page in the Business Manager
The Business Manager is the place where the store owner can manage his store.
In this template we add a menu item to the Order page in the Business Manager.
<br>The file (/src/dashboard/menu-plugins/my-plugin/plugin.json) demionstrate how to add a menu item to the Order page in the Business Manager.

### Integration with WhatsUp web
WhatsUp web is a popular messaging app that allows you to send messages directly to your customers.
In this template we integrate with WhatsUp web and send an up sale message to the customer.
<br> the message includes the selected product details and a link to the store product with a coupon code.
## Setup 🔧

##### Install dependencies:

```console
yarn install
```

## Available Scripts

In the project directory, you can run:

```console
yarn dev
```
