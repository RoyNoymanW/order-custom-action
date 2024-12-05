import { orders } from '@wix/ecom';

export async function GET(req: Request) {
    const id = new URL(req.url).searchParams.get('orderId') as string;

    // https://dev.wix.com/docs/sdk/backend-modules/ecom/orders/get-order
    const order = await orders.getOrder(id);

    return Response.json(order);
};