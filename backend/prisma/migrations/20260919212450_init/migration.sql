-- CreateEnum
CREATE TYPE "TipoUnidadOrganizativa" AS ENUM ('AREA', 'DIVISION', 'DEPARTAMENTO', 'SECTOR');

-- CreateEnum
CREATE TYPE "TipoResponsabilidadRaci" AS ENUM ('R', 'A', 'C', 'I');

-- CreateTable
CREATE TABLE "organizaciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "organizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_organizativas" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "unidadPadreId" TEXT,
    "tipo" "TipoUnidadOrganizativa" NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "unidades_organizativas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trabajadores" (
    "id" TEXT NOT NULL,
    "unidadOrganizativaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "correo" TEXT,

    CONSTRAINT "trabajadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "politicas" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "responsableId" TEXT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
    "fechaRevision" TIMESTAMP(3),

    CONSTRAINT "politicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" TEXT NOT NULL,
    "criticidad" TEXT NOT NULL DEFAULT 'MEDIA',
    "unidadOrganizativaId" TEXT NOT NULL,
    "responsableId" TEXT,

    CONSTRAINT "activos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerabilidades" (
    "id" TEXT NOT NULL,
    "activoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "cvss" DOUBLE PRECISION,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTA',
    "responsableId" TEXT,

    CONSTRAINT "vulnerabilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riesgos" (
    "id" TEXT NOT NULL,
    "activoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "probabilidad" TEXT NOT NULL,
    "impacto" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTO',
    "responsableId" TEXT,

    CONSTRAINT "riesgos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidentes" (
    "id" TEXT NOT NULL,
    "activoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "severidad" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTO',
    "responsableId" TEXT,

    CONSTRAINT "incidentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procesos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "procesos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidencias" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "responsableId" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" TEXT NOT NULL,
    "ubicacion" TEXT,
    "politicaId" TEXT,
    "riesgoId" TEXT,
    "vulnerabilidadId" TEXT,
    "incidenteId" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "responsableId" TEXT,
    "riesgoId" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedimientos" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "politicaId" TEXT NOT NULL,
    "responsableId" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',

    CONSTRAINT "procedimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones_raci" (
    "id" TEXT NOT NULL,
    "procesoId" TEXT NOT NULL,
    "trabajadorId" TEXT NOT NULL,
    "tipoResponsabilidad" "TipoResponsabilidadRaci" NOT NULL,

    CONSTRAINT "asignaciones_raci_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "unidades_organizativas_organizacionId_idx" ON "unidades_organizativas"("organizacionId");

-- CreateIndex
CREATE INDEX "unidades_organizativas_unidadPadreId_idx" ON "unidades_organizativas"("unidadPadreId");

-- CreateIndex
CREATE INDEX "trabajadores_unidadOrganizativaId_idx" ON "trabajadores"("unidadOrganizativaId");

-- CreateIndex
CREATE INDEX "politicas_organizacionId_idx" ON "politicas"("organizacionId");

-- CreateIndex
CREATE INDEX "politicas_responsableId_idx" ON "politicas"("responsableId");

-- CreateIndex
CREATE INDEX "activos_unidadOrganizativaId_idx" ON "activos"("unidadOrganizativaId");

-- CreateIndex
CREATE INDEX "activos_responsableId_idx" ON "activos"("responsableId");

-- CreateIndex
CREATE INDEX "vulnerabilidades_activoId_idx" ON "vulnerabilidades"("activoId");

-- CreateIndex
CREATE INDEX "vulnerabilidades_responsableId_idx" ON "vulnerabilidades"("responsableId");

-- CreateIndex
CREATE INDEX "riesgos_activoId_idx" ON "riesgos"("activoId");

-- CreateIndex
CREATE INDEX "riesgos_responsableId_idx" ON "riesgos"("responsableId");

-- CreateIndex
CREATE INDEX "incidentes_activoId_idx" ON "incidentes"("activoId");

-- CreateIndex
CREATE INDEX "incidentes_responsableId_idx" ON "incidentes"("responsableId");

-- CreateIndex
CREATE INDEX "evidencias_organizacionId_idx" ON "evidencias"("organizacionId");

-- CreateIndex
CREATE INDEX "evidencias_responsableId_idx" ON "evidencias"("responsableId");

-- CreateIndex
CREATE INDEX "evidencias_politicaId_idx" ON "evidencias"("politicaId");

-- CreateIndex
CREATE INDEX "evidencias_riesgoId_idx" ON "evidencias"("riesgoId");

-- CreateIndex
CREATE INDEX "evidencias_vulnerabilidadId_idx" ON "evidencias"("vulnerabilidadId");

-- CreateIndex
CREATE INDEX "evidencias_incidenteId_idx" ON "evidencias"("incidenteId");

-- CreateIndex
CREATE INDEX "planes_organizacionId_idx" ON "planes"("organizacionId");

-- CreateIndex
CREATE INDEX "planes_responsableId_idx" ON "planes"("responsableId");

-- CreateIndex
CREATE INDEX "planes_riesgoId_idx" ON "planes"("riesgoId");

-- CreateIndex
CREATE INDEX "procedimientos_organizacionId_idx" ON "procedimientos"("organizacionId");

-- CreateIndex
CREATE INDEX "procedimientos_politicaId_idx" ON "procedimientos"("politicaId");

-- CreateIndex
CREATE INDEX "procedimientos_responsableId_idx" ON "procedimientos"("responsableId");

-- CreateIndex
CREATE INDEX "asignaciones_raci_procesoId_idx" ON "asignaciones_raci"("procesoId");

-- CreateIndex
CREATE INDEX "asignaciones_raci_trabajadorId_idx" ON "asignaciones_raci"("trabajadorId");

-- CreateIndex
CREATE UNIQUE INDEX "asignaciones_raci_procesoId_trabajadorId_tipoResponsabilida_key" ON "asignaciones_raci"("procesoId", "trabajadorId", "tipoResponsabilidad");

-- AddForeignKey
ALTER TABLE "unidades_organizativas" ADD CONSTRAINT "unidades_organizativas_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades_organizativas" ADD CONSTRAINT "unidades_organizativas_unidadPadreId_fkey" FOREIGN KEY ("unidadPadreId") REFERENCES "unidades_organizativas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trabajadores" ADD CONSTRAINT "trabajadores_unidadOrganizativaId_fkey" FOREIGN KEY ("unidadOrganizativaId") REFERENCES "unidades_organizativas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "politicas" ADD CONSTRAINT "politicas_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "politicas" ADD CONSTRAINT "politicas_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activos" ADD CONSTRAINT "activos_unidadOrganizativaId_fkey" FOREIGN KEY ("unidadOrganizativaId") REFERENCES "unidades_organizativas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activos" ADD CONSTRAINT "activos_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vulnerabilidades" ADD CONSTRAINT "vulnerabilidades_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vulnerabilidades" ADD CONSTRAINT "vulnerabilidades_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riesgos" ADD CONSTRAINT "riesgos_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riesgos" ADD CONSTRAINT "riesgos_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_politicaId_fkey" FOREIGN KEY ("politicaId") REFERENCES "politicas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_riesgoId_fkey" FOREIGN KEY ("riesgoId") REFERENCES "riesgos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_vulnerabilidadId_fkey" FOREIGN KEY ("vulnerabilidadId") REFERENCES "vulnerabilidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_incidenteId_fkey" FOREIGN KEY ("incidenteId") REFERENCES "incidentes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes" ADD CONSTRAINT "planes_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes" ADD CONSTRAINT "planes_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes" ADD CONSTRAINT "planes_riesgoId_fkey" FOREIGN KEY ("riesgoId") REFERENCES "riesgos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimientos" ADD CONSTRAINT "procedimientos_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimientos" ADD CONSTRAINT "procedimientos_politicaId_fkey" FOREIGN KEY ("politicaId") REFERENCES "politicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimientos" ADD CONSTRAINT "procedimientos_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_raci" ADD CONSTRAINT "asignaciones_raci_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "procesos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_raci" ADD CONSTRAINT "asignaciones_raci_trabajadorId_fkey" FOREIGN KEY ("trabajadorId") REFERENCES "trabajadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
