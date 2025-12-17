import { Contact } from "../../Contacts/DTOs/ContactProps";
import { Client } from "../../Clients/DTOs/ClientProps";
import { User } from "../../Users/DTOs/User";

enum SiteStatus {
  YET_TO_START = "Yet to start",
  WORKING = "Working",
  HOLD = "Hold",
  COMPLETED = "Completed",
}

interface SiteCreationRequest {
  name: string;
  clientId: number;
  googleLocation: string;
  note: string;
  contactId: number;
  supervisorIds: number[];  
}

interface SiteUpdationRequest extends SiteCreationRequest {
  status: string; 
}

interface Site {
  id: number;
  name: string;
  client: Client;
  googleLocation: string;
  note: string;
  contact: Contact;
  supervisors: User[];
  status: string;
}

export { SiteStatus };
export type { SiteCreationRequest, SiteUpdationRequest, Site };
