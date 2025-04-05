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
    "type" TEXT NOT NULL DEFAULT 'apartment',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "House_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "House_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_House" ("address", "amenities", "bathrooms", "bedrooms", "createdAt", "description", "homeownerId", "id", "images", "price", "size", "status", "title", "updatedAt", "userId") SELECT "address", "amenities", "bathrooms", "bedrooms", "createdAt", "description", "homeownerId", "id", "images", "price", "size", "status", "title", "updatedAt", "userId" FROM "House";
DROP TABLE "House";
ALTER TABLE "new_House" RENAME TO "House";
CREATE INDEX "House_homeownerId_idx" ON "House"("homeownerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
