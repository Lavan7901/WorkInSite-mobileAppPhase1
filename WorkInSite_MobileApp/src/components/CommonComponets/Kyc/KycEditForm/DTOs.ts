
import {KYCTypes, KycTypesProps} from '../DTOs/DTOs';

interface KycEditFormProps extends KycTypesProps {
  selectedItem: {id: number; type: KYCTypes; value: string};
 Ref?: React.RefObject<{ close: () => void }>;
}

export type {KycEditFormProps};
