// Calendar and climate of the valley: a cool-temperate continental climate at about 50 degrees north.
// Seasons are the one compression of real time; see ARCHITECTURE.md.
export const CALENDAR = {
  daysPerSeason: 15,
  seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
  start: { season: 0, day: 4, hour: 7 },   // a cold morning early in spring (late March)
  latitude: 50,
  // The calendar year starts at the spring equinox: real day-of-year 80.
  equinoxDoy: 80,
};

export const CLIMATE = {
  meanC: 7.5,          // annual mean air temperature at the valley floor
  annualAmpC: 11,      // half the difference between July and January means
  warmestDoy: 200,     // real day-of-year of the warmest mean (mid July)
  diurnalAmpC: 5.5,    // half the clear-sky day/night swing
  lapseCPerM: 0.0065,  // temperature drop per metre of elevation
  anomalyRho: 0.985,   // hourly persistence of the weather anomaly
  anomalySd: 0.55,     // hourly noise in the anomaly (stationary sd is about 3.2 C)
  // Probability per hour that clouds build or break, by season (spring, summer, autumn, winter)
  cloudBuild: [0.07, 0.05, 0.08, 0.08],
  cloudBreak: [0.06, 0.08, 0.05, 0.05],
  // Mean precipitation rate while raining, mm/h
  rainRate: [1.6, 2.4, 1.8, 1.2],
  stormChancePerDay: [0.08, 0.14, 0.1, 0.06],
  windMean: 3.2,       // m/s at 10 m
};
