CREATE TABLE "evaluaciones_bcu" (
 "id" TEXT NOT NULL, "organizacionId" TEXT NOT NULL, "controlId" TEXT NOT NULL,
 "respuesta" TEXT, "justificacion" TEXT, "evidencia" TEXT, "demostracion" TEXT,
 CONSTRAINT "evaluaciones_bcu_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "evaluaciones_bcu_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "evaluaciones_bcu_organizacionId_controlId_key" ON "evaluaciones_bcu"("organizacionId", "controlId");


