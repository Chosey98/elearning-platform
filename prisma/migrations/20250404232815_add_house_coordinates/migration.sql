-- DropIndex
DROP INDEX "Rental_houseId_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_House" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "price" REAL NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "size" REAL NOT NULL,
    "amenities" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "type" TEXT NOT NULL DEFAULT 'apartment',
    "homeownerId" TEXT NOT NULL,
    "currentRentalId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "House_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "House_currentRentalId_fkey" FOREIGN KEY ("currentRentalId") REFERENCES "Rental" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "House_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_House" ("address", "amenities", "bathrooms", "bedrooms", "createdAt", "description", "homeownerId", "id", "images", "price", "size", "status", "title", "type", "updatedAt", "userId") SELECT "address", "amenities", "bathrooms", "bedrooms", "createdAt", "description", "homeownerId", "id", "images", "price", "size", "status", "title", "type", "updatedAt", "userId" FROM "House";
DROP TABLE "House";
ALTER TABLE "new_House" RENAME TO "House";
CREATE UNIQUE INDEX "House_currentRentalId_key" ON "House"("currentRentalId");
CREATE INDEX "House_homeownerId_idx" ON "House"("homeownerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Rental_houseId_idx" ON "Rental"("houseId");
