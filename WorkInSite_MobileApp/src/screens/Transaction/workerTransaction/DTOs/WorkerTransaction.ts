import { Worker } from "../../../Workers/DTOs/WorkerProps";
import { PaymentMethodEnum } from "../../ClientTransaction/DTOs/ClientTransaction";

interface WorkerTransactionRequest {
  workerId: string;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
}

interface WorkerTransactionProps {
  worker: Worker;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
  id: number;
}

export type {WorkerTransactionRequest, WorkerTransactionProps};
