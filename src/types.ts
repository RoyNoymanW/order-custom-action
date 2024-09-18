
export type Settings = {
  amount: number;
  title: string;
  color: string;
  iconColor: string;
};

export type OrderDetails = {
  contactDetails :ContactDetails | null;
  orderProducts: ProductsDetails[] | undefined;
}
export type ContactDetails ={
  phoneNumber: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
};
export type ProductsDetails = {
  productName: string | undefined;
  image: string | undefined;
  catalogItemId: string | undefined;
}
