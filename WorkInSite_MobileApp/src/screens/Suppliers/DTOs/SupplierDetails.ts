import { MutableRefObject } from 'react';
import {Supplier, SupplierRequest} from './SupplierProps';

interface SupplierDetailsType {
  supplierDetails: SupplierRequest | Supplier;
  setSupplierDetails: React.Dispatch<
    React.SetStateAction<SupplierRequest | Supplier>
  >;
  Ref?: MutableRefObject<any>
}

export type {SupplierDetailsType};
