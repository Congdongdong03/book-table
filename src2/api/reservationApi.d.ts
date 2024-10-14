declare module "./reservationApi" {
  export function makeReservation(
    date: string,
    time: string
  ): Promise<{ status: string; message: string }>;

  export function getUnavailableDates(): Promise<{
    data: { unavailable_dates: string[] };
  }>;

  export function getUnavailableTimesForDate(
    date: string
  ): Promise<{ data: { unavailable_times: string[] } }>;
}
