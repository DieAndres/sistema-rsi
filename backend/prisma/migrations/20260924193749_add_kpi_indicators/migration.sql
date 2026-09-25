-- CreateTable
CREATE TABLE "indicadores_kpi" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "formula" TEXT NOT NULL,
    "meta" DOUBLE PRECISION NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indicadores_kpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mediciones_kpi" (
    "id" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mediciones_kpi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "indicadores_kpi_codigo_key" ON "indicadores_kpi"("codigo");

-- CreateIndex
CREATE INDEX "mediciones_kpi_indicadorId_fechaRegistro_idx" ON "mediciones_kpi"("indicadorId", "fechaRegistro");

-- AddForeignKey
ALTER TABLE "mediciones_kpi" ADD CONSTRAINT "mediciones_kpi_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "indicadores_kpi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
