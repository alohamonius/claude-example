import * as migration_20251003_160511 from './20251003_160511';

export const migrations = [
  {
    up: migration_20251003_160511.up,
    down: migration_20251003_160511.down,
    name: '20251003_160511'
  },
];
