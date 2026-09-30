CREATE TABLE "Passkey" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "counter" INTEGER NOT NULL,
    "transports" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PasskeyChallenge" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PasskeyChallenge_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Passkey_usuarioId_idx" ON "Passkey"("usuarioId");
CREATE INDEX "PasskeyChallenge_usuarioId_tipo_idx" ON "PasskeyChallenge"("usuarioId", "tipo");
CREATE INDEX "PasskeyChallenge_expiraEn_idx" ON "PasskeyChallenge"("expiraEn");
ALTER TABLE "Passkey" ADD CONSTRAINT "Passkey_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PasskeyChallenge" ADD CONSTRAINT "PasskeyChallenge_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
