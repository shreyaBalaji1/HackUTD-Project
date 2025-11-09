/*
  Warnings:

  - You are about to drop the column `engine` on the `Car` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "trim" TEXT,
    "body" TEXT,
    "engine_position" TEXT,
    "engine_type" TEXT,
    "engine_cylinders" INTEGER,
    "engine_power_ps" INTEGER,
    "engine_power_rpm" INTEGER,
    "engine_torque_nm" INTEGER,
    "engine_torque_rpm" INTEGER,
    "engine_fuel" TEXT,
    "transmission" TEXT,
    "drive" TEXT,
    "doors" INTEGER,
    "seats" INTEGER,
    "weight_kg" INTEGER,
    "length_mm" INTEGER,
    "width_mm" INTEGER,
    "height_mm" INTEGER,
    "wheelbase_mm" INTEGER,
    "lkm_hwy" REAL,
    "lkm_city" REAL,
    "lkm_mixed" REAL,
    "fuel_cap_l" REAL,
    "top_speed_kph" INTEGER,
    "acceleration_0_to_100" REAL,
    "sold_in_us" BOOLEAN
);
INSERT INTO "new_Car" ("body", "id", "make", "model", "transmission", "trim", "year") SELECT "body", "id", "make", "model", "transmission", "trim", "year" FROM "Car";
DROP TABLE "Car";
ALTER TABLE "new_Car" RENAME TO "Car";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
