ALTER TABLE "organizaciones" ADD COLUMN "perfilMcu" TEXT NOT NULL DEFAULT 'Avanzado';
ALTER TABLE "organizaciones" ADD CONSTRAINT "organizaciones_perfilMcu_check" CHECK ("perfilMcu" IN ('Básico', 'Estándar', 'Avanzado'));
