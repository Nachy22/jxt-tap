// Replace with your computer's local IP whenever it changes (e.g. new WiFi network)
const BASE_URL = 'http://10.81.212.13:3000';

export type TransactionResult =
  | {
      success: true;
      fare: string;
      cardUid: string;
      routeStage: string;
      remainingBalance: string;
    }
  | {
      success: false;
      reason: string;
      cardBalance: string;
      fare: string;
      cardUid: string;
      routeStage: string;
    };

export type DriverSummary = {
  total: string;
  trips: number;
};

export type FareTransaction = {
  id: string;
  time: string;
  route: string;
  fare: number;
};

export type DriverInfo = {
  id: number;
  name: string;
  routeId: number;
  routeName: string;
  currentLeg: string | null;
  fromStopId: number | null;
  toStopId: number | null;
};

export type RouteLeg = {
  fromStopId: number;
  toStopId: number;
  label: string;
  fare: string;
};

// Sends a scanned card to the backend to process the fare payment
export const processTransaction = async (
  cardUid: string,
  driverId: number,
): Promise<TransactionResult | null> => {
  try {
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardUid, driverId }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Transaction request failed:', data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Network error calling /transactions:', error);
    return null;
  }
};

// Gets today's total collected and trip count for a driver
export const getDriverSummary = async (
  driverId: number,
): Promise<DriverSummary | null> => {
  try {
    const response = await fetch(`${BASE_URL}/driver/${driverId}/summary`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Network error calling /driver/summary:', error);
    return null;
  }
};

// Gets today's list of successful fares for a driver
export const getDriverTransactions = async (
  driverId: number,
): Promise<FareTransaction[] | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/driver/${driverId}/transactions`,
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Network error calling /driver/transactions:', error);
    return null;
  }
};

// Gets the driver's info, including their current route and leg
export const getDriverInfo = async (
  driverId: number,
): Promise<DriverInfo | null> => {
  try {
    const response = await fetch(`${BASE_URL}/driver/${driverId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Network error calling /driver:', error);
    return null;
  }
};

// Gets all available stop-to-stop legs (with fares) for a route
export const getRouteLegs = async (
  routeId: number,
): Promise<RouteLeg[] | null> => {
  try {
    const response = await fetch(`${BASE_URL}/routes/${routeId}/legs`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Network error calling /routes/legs:', error);
    return null;
  }
};

// Updates which leg the driver is currently serving
export const setCurrentLeg = async (
  driverId: number,
  fromStopId: number,
  toStopId: number,
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${BASE_URL}/driver/${driverId}/current-leg`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromStopId, toStopId }),
      },
    );
    return response.ok;
  } catch (error) {
    console.error('Network error calling /driver/current-leg:', error);
    return false;
  }
};