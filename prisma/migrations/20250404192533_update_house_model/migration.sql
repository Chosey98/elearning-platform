/*
  Warnings:

  - You are about to drop the column `currentRentalId` on the `House` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `House` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[houseId]` on the table `Rental` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bathrooms` to the `House` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `House` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `House` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_House" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "size" REAL NOT NULL,
    "amenities" TEXT NOT NULL DEFAULT '[]',
    "images" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "House_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "House_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_House" ("address", "createdAt", "description", "homeownerId", "id", "price", "status", "title", "updatedAt") SELECT "address", "createdAt", "description", "homeownerId", "id", "price", "status", "title", "updatedAt" FROM "House";
DROP TABLE "House";
ALTER TABLE "new_House" RENAME TO "House";
CREATE INDEX "House_homeownerId_idx" ON "House"("homeownerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Rental_houseId_key" ON "Rental"("houseId");

-- CreateIndex
CREATE INDEX "Rental_renterId_idx" ON "Rental"("renterId");
