-- CreateEnum
CREATE TYPE "LiquorUnit" AS ENUM ('ML', 'LTR');

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "inStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isLiquor" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "department" DROP DEFAULT;

-- CreateTable
CREATE TABLE "LiquorVariant" (
    "id" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" "LiquorUnit" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiquorVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LiquorVariant" ADD CONSTRAINT "LiquorVariant_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
