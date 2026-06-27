-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('TK', 'FM', 'BM', 'HT');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('MORTAL', 'ARCH', 'CELESTIAL', 'RD', 'BAHAMUT');

-- CreateEnum
CREATE TYPE "WeaponEquipmentType" AS ENUM ('MORTAL', 'ARCH', 'CELESTIAL', 'RD');

-- CreateEnum
CREATE TYPE "CytheraType" AS ENUM ('M', 'A', 'AMUNRA', 'BAHAMUT', 'ANUBIS');

-- CreateEnum
CREATE TYPE "MantleType" AS ENUM ('CELESTIAL', 'BAHAMUT');

-- CreateEnum
CREATE TYPE "MountType" AS ENUM ('TF', 'DV', 'DL', 'CHACAL_AZUL', 'CHACAL_VERMELHO', 'JACKAL_BLAZEBORN', 'JACKAL_FROSTBORN');

-- CreateEnum
CREATE TYPE "SuitType" AS ENUM ('S1200', 'S1300', 'S1400');

-- CreateEnum
CREATE TYPE "AmuletSlotType" AS ENUM ('BRINCO', 'AMUNRA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "guild" TEXT,
    "hasGuild" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seal" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "bodyClass" "ClassType" NOT NULL,
    "class1Type" "ClassType" NOT NULL,
    "class1Lineage" TEXT NOT NULL,
    "class1Level" INTEGER NOT NULL DEFAULT 0,
    "class1Has11th" BOOLEAN NOT NULL DEFAULT false,
    "class1Has12th" BOOLEAN NOT NULL DEFAULT false,
    "class1Spectral" BOOLEAN NOT NULL DEFAULT false,
    "class1Concentration" BOOLEAN NOT NULL DEFAULT false,
    "class1Resurrection" BOOLEAN NOT NULL DEFAULT false,
    "class2Type" "ClassType",
    "class2Lineage" TEXT,
    "class2Level" INTEGER,
    "class2Has11th" BOOLEAN NOT NULL DEFAULT false,
    "class2Has12th" BOOLEAN NOT NULL DEFAULT false,
    "class2Spectral" BOOLEAN NOT NULL DEFAULT false,
    "class2Concentration" BOOLEAN NOT NULL DEFAULT false,
    "class2Resurrection" BOOLEAN NOT NULL DEFAULT false,
    "mantleType" "MantleType",
    "mantleRefinement" INTEGER,
    "mantleAdditional" TEXT,
    "mantleTier" INTEGER,

    CONSTRAINT "Seal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountGear" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "cytheraType" "CytheraType",
    "cytheraRefinement" INTEGER,
    "cytheraAdditional" TEXT,
    "amulet1Type" "AmuletSlotType",
    "amulet1ItemTier" INTEGER,
    "amulet1Refinement" INTEGER,
    "amulet1AdditionalTier" INTEGER,
    "amulet2Refinement" INTEGER,
    "amulet2Tier" INTEGER,
    "amulet3Refinement" INTEGER,
    "amulet3Tier" INTEGER,
    "amulet4Refinement" INTEGER,
    "amulet4Tier" INTEGER,
    "necklaceItemTier" INTEGER,
    "necklaceRefinement" INTEGER,
    "necklaceAdditionalTier" INTEGER,
    "beltItemTier" INTEGER,
    "beltRefinement" INTEGER,
    "beltAdditionalTier" INTEGER,

    CONSTRAINT "AccountGear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemSet" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "suit" "SuitType",
    "helmetType" "EquipmentType",
    "helmetRefinement" INTEGER,
    "helmetAdditional" TEXT,
    "chestType" "EquipmentType",
    "chestRefinement" INTEGER,
    "chestAdditional" TEXT,
    "pantsType" "EquipmentType",
    "pantsRefinement" INTEGER,
    "pantsAdditional" TEXT,
    "glovesType" "EquipmentType",
    "glovesRefinement" INTEGER,
    "glovesAdditional" TEXT,
    "bootsType" "EquipmentType",
    "bootsRefinement" INTEGER,
    "bootsAdditional" TEXT,
    "weaponType" "WeaponEquipmentType",
    "weaponRefinement" INTEGER,
    "weaponAdditional" TEXT,
    "weaponAncient" BOOLEAN NOT NULL DEFAULT false,
    "mountType" "MountType",
    "mountLevel" INTEGER,
    "mountVitality" INTEGER,
    "mountQuality" INTEGER,

    CONSTRAINT "ItemSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckinCycle" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "currentDay" INTEGER NOT NULL DEFAULT 1,
    "lastCheckin" TIMESTAMP(3),

    CONSTRAINT "CheckinCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "checkinDone" BOOLEAN NOT NULL DEFAULT false,
    "desertDone" BOOLEAN NOT NULL DEFAULT false,
    "spoilsDone" BOOLEAN NOT NULL DEFAULT false,
    "infernalCount" INTEGER NOT NULL DEFAULT 0,
    "mortalDelivered" BOOLEAN NOT NULL DEFAULT false,
    "towersDone" BOOLEAN,
    "kefraDone" BOOLEAN,
    "cityWarDone" BOOLEAN,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seal_characterId_key" ON "Seal"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountGear_characterId_key" ON "AccountGear"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemSet_characterId_key" ON "ItemSet"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckinCycle_characterId_key" ON "CheckinCycle"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_characterId_date_key" ON "DailyLog"("characterId", "date");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seal" ADD CONSTRAINT "Seal_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountGear" ADD CONSTRAINT "AccountGear_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSet" ADD CONSTRAINT "ItemSet_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinCycle" ADD CONSTRAINT "CheckinCycle_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
