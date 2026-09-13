import adminApi from "./adminApi";

export default async function downloadBlob(url, defaultFilename) {
  const res = await adminApi.get(url, { responseType: "blob" });

  const contentDisposition = res.headers["content-disposition"];
  let filename = defaultFilename;

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+?)"?$/);
    if (match) filename = match[1];
  }

  const blob = new Blob([res.data]);
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}
