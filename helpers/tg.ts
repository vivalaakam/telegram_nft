const sendMessageUrl = `https://api.telegram.org/bot${process.env.NEXT_TELEGRAM_TOKEN}/sendMessage`;
const fileUrl = `https://api.telegram.org/bot${process.env.NEXT_TELEGRAM_TOKEN}/getFile?file_id=`;
const downloadFileUrl = `https://api.telegram.org/file/bot${process.env.NEXT_TELEGRAM_TOKEN}/`;

export async function sendMessage(chat_id: String | number, message: String) {
  const req = await fetch(sendMessageUrl, {
    method: "POST",
    body: JSON.stringify({
      chat_id: chat_id,
      text: message,
      parse_mode: "markdown",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resp = await req.json();

  console.log("sendMessage", resp);

  return resp;
}

export async function getFile(file_id: String) {
  const req = await fetch(`${fileUrl}${file_id}`, {
    method: "GET",
  });

  const resp = await req.json();

  console.log("getFile", resp);

  return resp;
}

export async function downloadFile(file_path: String) {
  const req = await fetch(`${downloadFileUrl}${file_path}`, {
    method: "GET",
  });

  return await req.blob();
}
