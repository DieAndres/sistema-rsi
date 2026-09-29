-- CreateTable
CREATE TABLE "_ActivoToProceso" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActivoToProceso_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ActivoToProceso_B_index" ON "_ActivoToProceso"("B");

-- AddForeignKey
ALTER TABLE "_ActivoToProceso" ADD CONSTRAINT "_ActivoToProceso_A_fkey" FOREIGN KEY ("A") REFERENCES "activos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivoToProceso" ADD CONSTRAINT "_ActivoToProceso_B_fkey" FOREIGN KEY ("B") REFERENCES "procesos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
