/*
  Warnings:

  - Added the required column `cost` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interest` to the `Car` table without a default value. This is not possible if the table is not empty.

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
    "engine" TEXT,
    "color" TEXT,
    "cost" INTEGER NOT NULL,
    "interest" REAL NOT NULL
);
INSERT INTO "new_Car" ("body", "color", "engine", "id", "make", "model", "trim", "year") SELECT "body", "color", "engine", "id", "make", "model", "trim", "year" FROM "Car";
DROP TABLE "Car";
ALTER TABLE "new_Car" RENAME TO "Car";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
