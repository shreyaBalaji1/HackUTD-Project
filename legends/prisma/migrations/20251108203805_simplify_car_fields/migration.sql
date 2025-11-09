/*
  Warnings:

  - You are about to drop the column `acceleration_0_to_100` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `doors` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `drive` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engine_cylinders` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engine_fuel` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engine_position` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engine_power_ps` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engine_power_rpm` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engine_torque_nm` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engine_torque_rpm` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engine_type` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `fuel_cap_l` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `height_mm` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `length_mm` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `lkm_city` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `lkm_hwy` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `lkm_mixed` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `seats` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `sold_in_us` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `top_speed_kph` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `transmission` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `weight_kg` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `wheelbase_mm` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `width_mm` on the `Car` table. All the data in the column will be lost.

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
    "engine" TEXT
);
INSERT INTO "new_Car" ("body", "id", "make", "model", "trim", "year") SELECT "body", "id", "make", "model", "trim", "year" FROM "Car";
DROP TABLE "Car";
ALTER TABLE "new_Car" RENAME TO "Car";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
