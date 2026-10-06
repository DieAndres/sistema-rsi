CREATE TABLE "evaluaciones_mcu" (
 "id" TEXT NOT NULL, "organizacionId" TEXT NOT NULL, "controlId" TEXT NOT NULL,
 "respuesta" TEXT, "justificacion" TEXT, "evidencia" TEXT, "demostracion" TEXT,
 CONSTRAINT "evaluaciones_mcu_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "evaluaciones_mcu_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "evaluaciones_mcu_organizacionId_controlId_key" ON "evaluaciones_mcu"("organizacionId", "controlId");

