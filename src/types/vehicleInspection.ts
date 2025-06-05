export interface VehicleInspection {
  id: string;
  date: string;
  vehicle: string;
  driver: string;
  mileage: number;
  items: {
    // Body & Exterior
    bodyPanels: boolean;
    windscreenWipers: boolean;
    numberPlatesAndPermits: boolean;
    tires: boolean;
    spareWheel: boolean;
    tonneauCover: boolean;
    exteriorCondition: boolean;
    
    // Engine & Mechanical
    fluidLevels: boolean;
    batteryAndTerminals: boolean;
    engineBelts: boolean;
    engineCompartment: boolean;
    
    // Lights & Electrical
    lights: boolean;
    brakes: boolean;
    hornAndHooter: boolean;
    mirrors: boolean;
    
    // Interior
    seatBelts: boolean;
    logbook: boolean;
    accessories: boolean;
    upholstery: boolean;
    interiorCondition: boolean;
    
    // Safety Equipment
    tools: boolean;
    firstAidKit: boolean;
    fireExtinguisher: boolean;
    buggyWhip: boolean;
    stopBlocks: boolean;
    strobeLight: boolean;
  };
  notes: string;
  damagePhotos?: string[];
  createdAt: string;
}

export type NewVehicleInspection = Omit<VehicleInspection, 'id' | 'createdAt'>;