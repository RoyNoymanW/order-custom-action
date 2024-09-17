
export type Settings = {
  amount: number;
  title: string;
  color: string;
  iconColor: string;
};

export type OrderDetails = {
  phoneNumber: string | null | undefined;
  orderProducts: (string | undefined)[] | undefined
}
