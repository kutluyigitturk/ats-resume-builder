-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "windowEnds" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateLimit_windowEnds_idx" ON "RateLimit"("windowEnds");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_bucket_key_key" ON "RateLimit"("bucket", "key");
