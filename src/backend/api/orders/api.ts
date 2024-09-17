import {orders} from '@wix/ecom';
import {getOrder} from "../../orders";

export async function GET(req: Request) {
    const _id = new URL(req.url).searchParams.get('orderId') as string;
    const order = await getOrder(_id);
    return Response.json(order);
}
