/*
  Warnings:

*/
-- AlterTable
ALTER TABLE "activos" ADD COLUMN     "clasificacion" TEXT;

-- AlterTable
ALTER TABLE "procedimientos" ADD COLUMN     "fechaRevision" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "procesos" ADD COLUMN     "fechaRevision" TIMESTAMP(3),
ADD COLUMN     "organizacionId" TEXT,
ADD COLUMN     "responsableId" TEXT,
ADD COLUMN     "version" TEXT NOT NULL DEFAULT '1.0';


-- AlterTable
ALTER TABLE "unidades_organizativas" ADD COLUMN     "responsableId" TEXT;

-- CreateTable
CREATE TABLE "hitos_planes" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaObjetivo" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "responsableId" TEXT,

    CONSTRAINT "hitos_planes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hitos_planes_planId_idx" ON "hitos_planes"("planId");

-- CreateIndex
CREATE INDEX "hitos_planes_responsableId_idx" ON "hitos_planes"("responsableId");

-- CreateIndex
CREATE INDEX "procesos_organizacionId_idx" ON "procesos"("organizacionId");

-- CreateIndex
CREATE INDEX "unidades_organizativas_responsableId_idx" ON "unidades_organizativas"("responsableId");

-- AddForeignKey
ALTER TABLE "unidades_organizativas" ADD CONSTRAINT "unidades_organizativas_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hitos_planes" ADD CONSTRAINT "hitos_planes_planId_fkey" FOREIGN KEY ("planId") REFERENCES "planes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hitos_planes" ADD CONSTRAINT "hitos_planes_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
