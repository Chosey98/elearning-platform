-- CreateTable
CREATE TABLE "CourseRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseRating_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HouseRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HouseRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HouseRating_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CourseRating_courseId_idx" ON "CourseRating"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseRating_userId_courseId_key" ON "CourseRating"("userId", "courseId");

-- CreateIndex
CREATE INDEX "HouseRating_houseId_idx" ON "HouseRating"("houseId");

-- CreateIndex
CREATE UNIQUE INDEX "HouseRating_userId_houseId_key" ON "HouseRating"("userId", "houseId");
