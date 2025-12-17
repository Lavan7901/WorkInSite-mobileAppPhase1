import {Client, ClientRequest} from './ClientProps';

interface ClientDetailsType {
  clientDetails: ClientRequest | Client;
  setClientDetails: React.Dispatch<
    React.SetStateAction<ClientRequest | Client>
  >;
  Ref?: React.MutableRefObject<any>;
}

export type {ClientDetailsType};
