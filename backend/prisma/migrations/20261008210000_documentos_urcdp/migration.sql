CREATE TABLE "bases_personales" (
 "id" TEXT PRIMARY KEY, "organizacionId" TEXT NOT NULL, "nombre" TEXT NOT NULL,
 "datos" JSONB NOT NULL, "revision" INTEGER NOT NULL DEFAULT 1, "actualizadoEn" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "bases_personales_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "notificaciones_urcdp" (
 "id" TEXT PRIMARY KEY, "organizacionId" TEXT NOT NULL, "baseId" TEXT NOT NULL, "incidenteId" TEXT NOT NULL,
 "datos" JSONB NOT NULL, "revision" INTEGER NOT NULL DEFAULT 1, "actualizadoEn" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "notificaciones_urcdp_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "notificaciones_urcdp_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "bases_personales"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "notificaciones_urcdp_incidenteId_fkey" FOREIGN KEY ("incidenteId") REFERENCES "incidentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "bases_personales_organizacionId_idx" ON "bases_personales"("organizacionId");
CREATE INDEX "notificaciones_urcdp_organizacionId_idx" ON "notificaciones_urcdp"("organizacionId");
CREATE INDEX "notificaciones_urcdp_baseId_idx" ON "notificaciones_urcdp"("baseId");
CREATE INDEX "notificaciones_urcdp_incidenteId_idx" ON "notificaciones_urcdp"("incidenteId");
