import { Supplier } from "../../../Suppliers/DTOs/SupplierProps";
import { PaymentMethodEnum } from "../../ClientTransaction/DTOs/ClientTransaction";


interface SupplierTransactionRequest {
  supplierId: string;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
}

interface SupplierTransactionProps {
  supplier: Supplier;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
  id: number;
}

export type {SupplierTransactionRequest, SupplierTransactionProps};
