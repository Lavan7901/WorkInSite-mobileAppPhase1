import {Worker, WorkerRequest} from './WorkerProps';

interface WorkerDetailsType {
  workerDetails: WorkerRequest | Worker;
  setWorkerDetails: React.Dispatch<
    React.SetStateAction<WorkerRequest | Worker>
  >;
  Ref?: React.MutableRefObject<any>;
}

export type {WorkerDetailsType};
