CREATE TABLE "acciones_incidente" (

 "id" TEXT NOT NULL PRIMARY KEY, "incidenteId" TEXT NOT NULL, "estado" TEXT NOT NULL, "descripcion" TEXT NOT NULL,

 "usuarioId" TEXT, "usuarioCorreo" TEXT, "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY ("incidenteId") REFERENCES "incidentes"("id") ON DELETE CASCADE ON UPDATE CASCADE

);

CREATE INDEX "acciones_incidente_incidenteId_fecha_idx" ON "acciones_incidente"("incidenteId", "fecha");

INSERT INTO "acciones_incidente" ("id", "incidenteId", "estado", "descripcion")

SELECT 'migracion-' || "id", "id", "estado", 'Registro preexistente: estado importado; sin cronología anterior disponible.' FROM "incidentes";

-- Estados no precisos vuelven a detección; el valor original queda arriba.

UPDATE "incidentes" SET "estado" = 'ABIERTO' WHERE "estado" NOT IN ('ABIERTO','CONTENIDO','ERRADICADO','RECUPERADO','CERRADO');

ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_estado_check" CHECK ("estado" IN ('ABIERTO','CONTENIDO','ERRADICADO','RECUPERADO','CERRADO'));

