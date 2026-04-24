!/usr/bin/env node
// Run: npx tsx scripts/generateSchedules.ts
// Output: public/data/schedules.json, public/data/timetables.json

import * as fs from 'fs';
import * as path from 'path';

const LINES = [
  { id: 'L1', number: '1', name: 'Bolevec – Slovany', type: 'tram', stops: ['Bolevec', 'Karlovarská', 'Hlavní nádraží', 'Náměstí Republiky', 'Tylova', 'Slovany'], color: '#fb8a00' },
  { id: 'L2', number: '2', name: 'Bory – Bolevec', type: 'tram', stops: ['Bory Terminal', 'Výstaviště', 'Hlavní nádraží', 'CAN', 'Bolevec'], color: '#fb8a00' },
  { id: 'L4', number: '4', name: 'Světovar – Skvrňany', type: 'tram', stops: ['Světovar', 'Husova', 'Náměstí Republiky', 'Štefánikovo nám.', 'Skvrňany'], color: '#fb8a00' },
  { id: 'L11', number: '11', name: 'Zátiší – Doubravka', type: 'trolley', stops: ['Zátiší', 'Klatovská', 'Prušvanka', 'Doubravka'], color: '#22c55e' },
  { id: 'L12', number: '12', name: 'Zátiší – Skvrňany', type: 'trolley', stops: ['Zátiší', 'Hlavní nádraží', 'CAN', 'Skvrňany'], color: '#22c55e' },
  { id: 'L15', number: '15', name: 'Centrum – Radčice', type: 'trolley', stops: ['Náměstí Republiky', 'Husova', 'Koterov', 'Radčice'], color: '#22c55e' },
  { id: 'L30', number: '30', name: 'Centrum – Borská Pole', type: 'bus', stops: ['Hlavní nádraží', 'Mrakodrap', 'Borská Pole'], color: '#10a4ff' },
  { id: 'L20', number: '20', name: 'Centrum – Doubravka', type: 'bus', stops: ['Náměstí Republiky', 'Tylova', 'Doubravka'], color: '#10a4ff' },
  { id: 'L40', number: '40', name: 'Centrum – Plzeň-sever', type: 'bus', stops: ['Náměstí Republiky', 'Štefánikovo nám.', 'Vinice', 'Plzeň-sever'], color: '#10a4ff' },
  { id: 'L48', number: '48', name: 'Lochotín – Bory', type: 'bus', stops: ['Lochotín', 'Výstaviště', 'Bory Terminal'], color: '#10a4ff' },
];

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function generateDepartures(startMin: number, endMin: number, intervalMin: number): string[] {
  const result: string[] = [];
  for (let t = startMin; t <= endMin; t += intervalMin) {
    result.push(minutesToTime(t));
  }
  return result;
}

interface TimetableEntry {
  lineId: string;
  lineNumber: string;
  stopName: string;
  direction: string;
  departures: string[];
}

const timetables: TimetableEntry[] = [];

for (const line of LINES) {
  for (let si = 0; si < line.stops.length; si++) {
    const stop = line.stops[si];
    const direction = line.stops[line.stops.length - 1];

    const departures: string[] = [
      // Early morning 6:00-7:30 (15 min)
      ...generateDepartures(360, 449, 15),
      // Morning peak 7:30-9:00 (5 min)
      ...generateDepartures(450, 540, 5),
      // Midday 9:00-14:30 (15 min)
      ...generateDepartures(540, 869, 15),
      // Afternoon peak 14:30-16:00 (5 min)
      ...generateDepartures(870, 960, 5),
      // Evening 16:00-22:00 (15 min)
      ...generateDepartures(960, 1320, 15),
    ].filter((t, i, arr) => arr.indexOf(t) === i).sort();

    timetables.push({ lineId: line.id, lineNumber: line.number, stopName: stop, direction, departures });
  }

  // Also reverse direction
  for (let si = line.stops.length - 1; si >= 0; si--) {
    const stop = line.stops[si];
    const direction = line.stops[0];

    const departures: string[] = [
      ...generateDepartures(360 + 7, 449 + 7, 15),
      ...generateDepartures(450 + 7, 540 + 7, 5),
      ...generateDepartures(540 + 7, 869 + 7, 15),
      ...generateDepartures(870 + 7, 960 + 7, 5),
      ...generateDepartures(960 + 7, 1320 + 7, 15),
    ].filter((t, i, arr) => arr.indexOf(t) === i).sort();

    timetables.push({ lineId: line.id, lineNumber: line.number, stopName: stop, direction, departures });
  }
}

const output = {
  generated: new Date().toISOString(),
  lines: LINES,
  timetables,
};

const outDir = path.join(process.cwd(), 'public', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'schedules.json'), JSON.stringify(output, null, 2));
console.log(`✅ Generated ${timetables.length} timetable entries → public/data/schedules.json`);
