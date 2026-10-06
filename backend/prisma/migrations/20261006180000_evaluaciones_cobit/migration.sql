CREATE TABLE "evaluaciones_cobit" (
"id" TEXT NOT NULL PRIMARY KEY, "organizacionId" TEXT NOT NULL, "procesoId" TEXT NOT NULL, "controlId" TEXT NOT NULL,
"evaluacion" TEXT, "evidencia" TEXT, "indicador" TEXT,
FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
FOREIGN KEY ("procesoId") REFERENCES "procesos"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "evaluaciones_cobit_organizacionId_procesoId_controlId_key" ON "evaluaciones_cobit"("organizacionId", "procesoId", "controlId");
CREATE INDEX "evaluaciones_cobit_procesoId_idx" ON "evaluaciones_cobit"("procesoId");