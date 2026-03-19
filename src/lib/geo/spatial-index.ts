import { haversineKm } from "@/lib/geo/haversine";

type CoordPair = [number, number];

const CELL_SIZE = 0.001;

function cellKey(lat: number, lng: number): string {
  return `${Math.floor(lat / CELL_SIZE)},${Math.floor(lng / CELL_SIZE)}`;
}

export class SpatialIndex {
  private grid = new Map<string, CoordPair[]>();

  constructor(points: CoordPair[]) {
    for (const p of points) {
      const key = cellKey(p[0], p[1]);
      const cell = this.grid.get(key);
      if (cell) {
        cell.push(p);
      } else {
        this.grid.set(key, [p]);
      }
    }
  }

  queryRadius(lat: number, lng: number, radiusKm: number): CoordPair[] {
    const cellSpan = Math.ceil(radiusKm / (CELL_SIZE * 111.32)) + 1;
    const centerCellLat = Math.floor(lat / CELL_SIZE);
    const centerCellLng = Math.floor(lng / CELL_SIZE);
    const results: CoordPair[] = [];

    for (let dlat = -cellSpan; dlat <= cellSpan; dlat++) {
      for (let dlng = -cellSpan; dlng <= cellSpan; dlng++) {
        const key = `${centerCellLat + dlat},${centerCellLng + dlng}`;
        const cell = this.grid.get(key);
        if (!cell) continue;
        for (const p of cell) {
          if (haversineKm(lat, lng, p[0], p[1]) <= radiusKm) {
            results.push(p);
          }
        }
      }
    }

    return results;
  }
}
