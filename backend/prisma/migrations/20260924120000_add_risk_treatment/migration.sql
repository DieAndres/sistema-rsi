ALTER TABLE "riesgos"
ADD COLUMN "tratamiento" TEXT,
ADD COLUMN "riesgoResidual" TEXT,
ADD COLUMN "aceptado" BOOLEAN NOT NULL DEFAULT false;
