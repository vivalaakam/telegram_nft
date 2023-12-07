export async function uploadFile(
  filename: string,
  data: Blob,
): Promise<{ Name: string; Hash: string; Size: string }> {
  const form = new FormData();
  form.append(filename, data, filename);

  const uploadResponse = await fetch(
    `${process.env.NEXT_IPFS_NODE}api/v0/add?pin=true`,
    {
      method: "POST",
      body: form,
      headers: {
        "accept-type": "application/json",
      },
    },
  );

  const resp = await uploadResponse.json();
  console.log(`upload ${filename} response:`, resp);

  return resp;
}
