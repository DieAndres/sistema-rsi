-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "mfaConfirmado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mfaSecret" TEXT;
