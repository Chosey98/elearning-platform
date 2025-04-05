/*
  Warnings:

  - You are about to drop the column `userId` on the `Course` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "imageUrl" TEXT,
    "syllabus" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "whatYouWillLearn" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("category", "createdAt", "description", "duration", "fullDescription", "id", "imageUrl", "instructorId", "language", "lastUpdated", "level", "price", "requirements", "syllabus", "title", "updatedAt", "whatYouWillLearn") SELECT "category", "createdAt", "description", "duration", "fullDescription", "id", "imageUrl", "instructorId", "language", "lastUpdated", "level", "price", "requirements", "syllabus", "title", "updatedAt", "whatYouWillLearn" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE INDEX "Course_instructorId_idx" ON "Course"("instructorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
