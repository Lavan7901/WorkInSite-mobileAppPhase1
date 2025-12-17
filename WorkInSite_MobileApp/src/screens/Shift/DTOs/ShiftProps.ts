// interface ShiftRequest {
//   name: string;
// }

// interface Shift {
//   id: number;
//   name: string;
// }

// export type {ShiftRequest, Shift};

//2

interface Shift {
  id: number;
  name: string;
  multiplier: string; 
}

interface ShiftRequest {
  name: string;
  multiplier: string; 
}

export type {Shift, ShiftRequest};
