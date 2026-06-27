-- CreateEnum
CREATE TYPE "ResourceCategory" AS ENUM ('POWDER', 'CRYSTAL', 'STONE', 'EMBLEM', 'MEDAL', 'DRAGON', 'BAHAMUT', 'TEAR', 'CYTHERA', 'MANTLE', 'MOUNT', 'COIN', 'OTHER');

-- CreateEnum
CREATE TYPE "ProcessCategory" AS ENUM ('ARMOR', 'WEAPON', 'CYTHERA', 'ACCESSORY', 'MANTLE', 'MOUNT');

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ResourceCategory" NOT NULL,
    "mobile" BOOLEAN NOT NULL DEFAULT true,
    "obtainHint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Process" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ProcessCategory" NOT NULL,
    "fromLevel" INTEGER,
    "toLevel" INTEGER,
    "successRate" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessResource" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "isConsumedOnFail" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProcessResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerInventory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resource_name_key" ON "Resource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessResource_processId_resourceId_key" ON "ProcessResource"("processId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerInventory_userId_resourceId_key" ON "PlayerInventory"("userId", "resourceId");

-- AddForeignKey
ALTER TABLE "ProcessResource" ADD CONSTRAINT "ProcessResource_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessResource" ADD CONSTRAINT "ProcessResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerInventory" ADD CONSTRAINT "PlayerInventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerInventory" ADD CONSTRAINT "PlayerInventory_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
