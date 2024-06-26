"use server";

import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/lib/crypt";
import { LocalOrderProps, ProductForOrderProps } from "@/lib/schema";

export async function incrementLocalOrder(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    const existedLocalOrder = cookies().get("order")?.value;
    if (!existedLocalOrder) {
      return;
    } else {
      const parsedOrder: LocalOrderProps = await decrypt(existedLocalOrder);
      const { products, total, ...spread } = parsedOrder;

      const selectedProduct = products.filter(
        (product) => product.id === id
      )[0];

      let updatedProducts = [];

      const filteredProducts = products.filter((product) => product.id !== id);
      selectedProduct.quantity += 1;
      updatedProducts = [...filteredProducts, selectedProduct];

      const updatedTotal = updatedProducts.reduce(
        (acc: number, el: ProductForOrderProps) => {
          const res = acc + el.quantity * el.price;
          return res;
        },
        0
      );

      const order = await encrypt({
        products: updatedProducts,
        total: updatedTotal,
        ...spread,
      });

      cookies().set("order", order, { httpOnly: true });
    }
  } catch (error) {
    return { error };
  }
}

export async function decrementLocalOrder(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    const existedLocalOrder = cookies().get("order")?.value;
    if (!existedLocalOrder) {
      return;
    } else {
      const parsedOrder: LocalOrderProps = await decrypt(existedLocalOrder);
      const { products, total, ...spread } = parsedOrder;

      const selectedProduct = products.filter(
        (product) => product.id === id
      )[0];

      let updatedProducts = [];

      if (selectedProduct.quantity === 1) {
        const filteredProducts = products.filter(
          (product) => product.id !== id
        );
        updatedProducts = filteredProducts;
      } else {
        const filteredProducts = products.filter(
          (product) => product.id !== id
        );
        selectedProduct.quantity -= 1;
        updatedProducts = [...filteredProducts, selectedProduct];
      }

      const updatedTotal = updatedProducts.reduce(
        (acc: number, el: ProductForOrderProps) => {
          const res = acc + el.quantity * el.price;
          return res;
        },
        0
      );

      const order = await encrypt({
        products: updatedProducts,
        total: updatedTotal,
        ...spread,
      });

      if (updatedProducts.length === 0) {
        cookies().delete("order");
      } else {
        cookies().set("order", order, { httpOnly: true });
      }
    }
  } catch (error) {
    return { error };
  }
}

export async function deleteProductFromOrder(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    const existedLocalOrder = cookies().get("order")?.value;
    if (!existedLocalOrder) {
      return;
    } else {
      const parsedOrder: LocalOrderProps = await decrypt(existedLocalOrder);
      const { products, total, ...spread } = parsedOrder;
      const updatedProducts = products.filter((order) => order.id !== id);

      const updatedTotal = updatedProducts.reduce(
        (acc: number, el: ProductForOrderProps) => {
          const res = acc + el.quantity * el.price;
          return res;
        },
        0
      );

      const order = await encrypt({
        products: updatedProducts,
        total: updatedTotal,
        ...spread,
      });

      if (updatedProducts.length === 0) {
        cookies().delete("order");
      } else {
        cookies().set("order", order, { httpOnly: true });
      }
    }
  } catch (error) {
    return { error };
  }
}
