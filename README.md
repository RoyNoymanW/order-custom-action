# Wix CLI App Template: Post-Order Messaging

The Post-Order Messaging Wix app template is part of the [Wix app templates collection](https://dev.wix.com/apps-templates).

This Wix CLI template demonstrates the use of the [Wix eCommerce Orders API](https://dev.wix.com/docs/sdk/backend-modules/ecom/orders/setup) to retrieve a site's order details and items, and how to integrate with WhatsApp to sell products.

The template also demonstrates the basic functionality of the React SDK and Wix Design System. 

> **Note:** This app is intended for Wix sites with the Wix Stores app installed. For it to function correctly, the site owner must [install Wix Stores](https://www.wix.com/app-market/wix-stores) from the app market.

## About Wix app templates

[Wix apps](https://dev.wix.com/docs/build-apps) enhance the functionality of Wix sites by adding new features such as custom pages, dashboard components, third-party integrations, or site analytics. Starting with an app template fast-tracks the development process, providing a working foundational app that developers can modify and build upon. This approach saves valuable time, allowing for a quick transition from concept to a fully functional app.

Learn more about [Wix app templates](https://dev.wix.com/docs/build-apps/get-started/templates/get-started-from-an-app-template) and explore our growing [template collection](https://dev.wix.com/apps-templates).

## Template features

This Wix app template incorporates the following features:

- **Wix CLI:** Get a comprehensive developer experience with minimal setup and host your app on Wix with one command. Learn more about the [Wix CLI for apps](https://dev.wix.com/docs/build-apps/developer-tools/cli/get-started/about-the-wix-cli-for-apps).
- **Wix Design System:** Utilize Wix's reusable React components for a cohesive user experience consistent with Wix's design standards.
- **Wix eCommerce Orders API**: Access and manage Wix eCommerce Orders data on a Wix site. (The eCom Orders API is for use with all Wix eCommerce flows, but in this case it's for use with products sold via Stores). Learn more about the [Wix eCommerce API](https://dev.wix.com/docs/sdk/backend-modules/ecom/introduction).
- **Backend API**: Define your own HTTP functions that can be called from your frontend code. Learn more about [Backend APIs](https://dev.wix.com/docs/build-apps/develop-your-app/frameworks/wix-cli/supported-extensions/backend-extensions/api/add-api-extensions-with-the-cli).
- **Dashboard modal:** Extend your Wix app's functionality by adding modals to your app's dashboard. Learn more about [Dashboard modals](https://dev.wix.com/docs/build-apps/develop-your-app/frameworks/wix-cli/supported-extensions/dashboard-extensions/dashboard-modals/add-dashboard-modal-extensions-with-the-cli).
- **Dashboard menu plugin:** Extend your Wix app's functionality by adding menu plugins to the user interface of an app built by Wix. Learn more about [Dashboard menu plugin extensions](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/dashboard-extensions/dashboard-plugins/dashboard-menu-plugins/dashboard-menu-plugin-extensions).
- **WhatsApp integration:** Prepare personalized WhatsApp messages to customers from within your app. These messages are loaded into WhatsApp, but must be sent manually.

## Prerequisites

Before getting started, make sure you have the following set up:

+ [Node.js](https://nodejs.org/en/) (v18.16.0 or higher)
+ [A Wix developer account](https://users.wix.com/signin?loginDialogContext=signup&referralInfo=HEADER&postLogin=https:%2F%2Fdev.wix.com%2Fdc3%2Fmy-apps&postSignUp=https:%2F%2Fdev.wix.com%2Fdc3%2Fmy-apps&forceRender=true)
+ A WhatsApp account

## Local Development

We first need to create local files for our app project and set up a local development environment for preview and testing.

## Step 1 | Create a new app project with the Post-Order Messaging template

Run the following command to create a new app project using this template:

```bash
[fill this in]
```

In the creation process, you will be asked for:

+ A **Wix app name**. This is the name that appears for your app in the App Dashboard.
+ A test site to install your app on. You can select an existing site or create a new development site.
+ A **package name**. This is the name of the package created locally for your project, and the name of the directory containing your project’s local files.

### What you get

This process registers a new app in the App Dashboard with the required permissions pre-configured, and it generates a new app project in your local file system. The project contains all the files your app needs to run locally and in production.

The project includes:

- Initial boilerplate code for a simple app with:
  - A [backend API extension](https://dev.wix.com/docs/build-apps/develop-your-app/frameworks/wix-cli/supported-extensions/backend-extensions/api/add-api-extensions-with-the-cli) that uses the Wix eCommerce Orders API to get the site's orders.
  - A dashboard menu plugin extension to add a Post-Order Messaging button to the order page's [More Actions menu](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/dashboard-extensions/dashboard-plugins/supported-wix-app-dashboard-pages/wix-e-commerce/wix-e-commerce-order-page#slot-4-more-actions-menu).
  - A [dashboard modal](https://dev.wix.com/docs/build-apps/develop-your-app/frameworks/wix-cli/supported-extensions/dashboard-extensions/dashboard-modals/add-dashboard-modal-extensions-with-the-cli) where users can select the product to sell and customize the message to the user.
  - Integration with WhatsApp using its [click to chat](https://faq.whatsapp.com/5913398998672934) functionality.
- A `package.json` file with your app's dependencies.

## Step 2 | Test the app

The app creation process installs the app on your chosen development site. However, there is still some configuration required before your app will function.

### Install the Wix Stores app

This app makes calls to the Wix eCommerce [Orders API](https://dev.wix.com/docs/sdk/backend-modules/ecom/orders/setup) to retrieve the latest orders made in the site’s store. Before you test this app on your development site, install the [Wix Stores app](https://www.wix.com/app-market/wix-stores) to [add the Wix eCommerce platform’s functionality](https://dev.wix.com/docs/rest/business-solutions/e-commerce/wix-e-commerce-platform-handbook/get-started/installation) to your site.

### Set up a local development environment

The app creation process installs the app on your chosen development site. However, you won’t see the app extensions on your site until you build the app and create a version. To test the app during development, set up a local development environment using the following command:

```tsx
npm run dev
```

The development environment is set up for hot reloading, so any changes you make to your code will be reflected in the browser.

### Testing steps

1. After setting up the local development environment, the CLI will prompt you with a menu. Press **D** to select dashboard, then press **1**. This opens your development sites' dashboard homepage.
2. Navigate to the **Sales > Orders** page and click on an order to open its specific order page.

  [screenshot]()

3. Click the **More actions** button, and then select **Sell with WhatsAPP** from the menu.


  [screenshot]()

4. Select a product or products to sell, then click **Send Message**. This opens WhatsApp Web to a newly created message ready to send to the customer.


  [screenshot]()

## Extend and customize the app 

The template is designed for easy customization and extension. Here are some suggested entry points where you can add your own custom logic or functionality:

### Customize the dashboard menu plugin

You can customize the name and icon of the dashboard menu plugin, and what happens when it's clicked.

Development entry point: [`template/src/dashboard/menu-plugins/my-plugin/plugin.json`](./template/src/dashboard/menu-plugins/my-plugin/plugin.json)

You can also replace this plugin with a plugin for another of the [Order page's plugin slots](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/dashboard-extensions/dashboard-plugins/supported-wix-app-dashboard-pages/wix-e-commerce/wix-e-commerce-order-page#slot-4-more-actions-menu).

### Customize the dashboard modal

Customize the dashboard modal to fit your specific needs, whether it's updating the UI or changing the functionality.

Development entry point: [`template/src/dashboard/modals/sell-message-modal/modal.tsx`](./template/src/dashboard/modals/sell-message-modal/modal.tsx)

### Customize the messaging integration

Customize how your app interacts with WhatsApp, or replace WhatsApp entirely with another messaging service.

Development entry points:

- [`template/src/utils/whatsapp-link-generator.ts`](./template/src/utils/whatsapp-link-generator.ts)
- [`template/src/dashboard/modals/sell-message-modal/modal.tsx`](./template/src/dashboard/modals/sell-message-modal/modal.tsx)

## Learn more

For more information:

+ Learn more about [Wix app templates](https://dev.wix.com/docs/build-apps/get-started/templates/get-started-from-an-app-template).
+ Check out our [full collection of app templates](https://dev.wix.com/apps-templates).
+ See our documentation for details about [building Wix apps](https://dev.wix.com/docs/build-apps).
