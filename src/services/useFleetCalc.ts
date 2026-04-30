/**
 * Sluzba pro vypocet noveho poctu vozdiel a ridicu pro posilove opatreni.
 * Vraci vypoctene hodnoty a data pro graf.
 */

/*
Finalni revize - 100%
 */

const BASE_VEHICLES = 12
const BASE_DRIVERS = Math.ceil(BASE_VEHICLES * 1.3)

export const useFleetCalc = (people: number, freqMin: number) => {
  const extra = Math.ceil((people / 1000) * (10 / freqMin))
  return {
    base: {vehicles: BASE_VEHICLES, drivers: BASE_DRIVERS},
    extra: {vehicles: extra, drivers: Math.ceil(extra * 1.3)},
    chartData: [
      {name: 'Běžný stav', vozy: BASE_VEHICLES, ridici: BASE_DRIVERS},
      {name: 'S posilou', vozy: BASE_VEHICLES + extra, ridici: BASE_DRIVERS + Math.ceil(extra * 1.3)},
    ],
  }
}