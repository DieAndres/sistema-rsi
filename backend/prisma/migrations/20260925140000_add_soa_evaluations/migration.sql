CREATE TABLE "evaluaciones_soa" (
  "id" TEXT NOT NULL,
  "organizacionId" TEXT NOT NULL,
  "controlId" TEXT NOT NULL,
  "titulo" TEXT,
  "aplica" BOOLEAN,
  "justificacion" TEXT,
  "insumos" TEXT,
  "estado" TEXT,
  "evidenciaId" TEXT,
  "planId" TEXT,
  CONSTRAINT "evaluaciones_soa_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "evaluaciones_soa_organizacionId_controlId_key" ON "evaluaciones_soa"("organizacionId", "controlId");
CREATE INDEX "evaluaciones_soa_evidenciaId_idx" ON "evaluaciones_soa"("evidenciaId");
CREATE INDEX "evaluaciones_soa_planId_idx" ON "evaluaciones_soa"("planId");

ALTER TABLE "evaluaciones_soa" ADD CONSTRAINT "evaluaciones_soa_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "evaluaciones_soa" ADD CONSTRAINT "evaluaciones_soa_evidenciaId_fkey" FOREIGN KEY ("evidenciaId") REFERENCES "evidencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "evaluaciones_soa" ADD CONSTRAINT "evaluaciones_soa_planId_fkey" FOREIGN KEY ("planId") REFERENCES "planes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "brechas_mcu" (
  "id" TEXT NOT NULL,
  "organizacionId" TEXT NOT NULL,
  "funcion" TEXT NOT NULL,
  "perfilObjetivo" TEXT,
  "evidencia" TEXT,
  "madurez" INTEGER,
  "acciones" TEXT,
  CONSTRAINT "brechas_mcu_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "brechas_mcu_organizacionId_funcion_key" ON "brechas_mcu"("organizacionId", "funcion");
ALTER TABLE "brechas_mcu" ADD CONSTRAINT "brechas_mcu_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
