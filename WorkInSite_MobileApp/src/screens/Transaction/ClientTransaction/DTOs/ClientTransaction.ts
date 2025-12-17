import {Client} from '../../../Clients/DTOs/ClientProps';

enum PaymentMethodEnum {
  CASH = 'Cash',
  CHEQUE = 'Cheque',
  BANK_TRANSFER = 'Bank_Transfer',
  UPI = 'UPI',
}

interface ClientTransactionRequest {
  clientId: string;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
}

interface ClientTransactionProps {
  client: Client;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
  id: number;
}

export {PaymentMethodEnum};
export type {ClientTransactionRequest, ClientTransactionProps};
