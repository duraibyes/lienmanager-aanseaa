import { BlobServiceClient } from "@azure/storage-blob";

const SAS_URL = "https://lienmanagerbucket.blob.core.windows.net/?sv=2024-11-04&ss=b&srt=co&sp=rwdlciytfx&se=2027-06-01T15:36:39Z&st=2026-03-18T07:21:39Z&spr=https&sig=tGM%2FvKikwXQvdsM2MEX%2FvVW%2Bs4k3sirR4gHMUduzjLU%3D";

const CONTAINER_NAME = "upload";

export const uploadToAzure = async (file: File) => {
  const blobServiceClient = new BlobServiceClient(SAS_URL);

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  const blobName = `${Date.now()}-${file.name}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  });

  return blockBlobClient.url;
};