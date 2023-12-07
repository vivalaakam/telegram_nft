import { ethers, isAddress, JsonRpcProvider } from "ethers";
import * as crypto from "crypto";
import { TelegramRequest } from "@/app/types";
import { ok } from "@/app/helpers/ok";
import { downloadFile, getFile, sendMessage } from "@/app/helpers/tg";
import { uploadFile } from "@/app/helpers/ipfs";

const verifierAbi =
  require("@/artifacts/contracts/Verification.sol/Verification.json").abi;
const nftAbi =
  require("@/artifacts/contracts/TelegramBot.sol/TelegramBot.json").abi;

export async function POST(request: Request) {
  const reqData = (await request.json()) as TelegramRequest;
  console.log(reqData);

  const provider = new JsonRpcProvider();
  const signer = new ethers.Wallet(
    process.env.NEXT_PRIVATE_KEY as string,
    provider,
  );
  const verifierContract = new ethers.Contract(
    process.env.NEXT_VERIFIER_ADDRESS as string,
    verifierAbi,
    signer,
  );

  const hash = crypto
    .createHash("sha256")
    .update(`${process.env.NEXT_SEED}:${reqData.message.from.id}`)
    .digest();

  let address = null;

  try {
    address = await verifierContract.verified("0x" + hash.toString("hex"));
  } catch (e) {
    console.log("address", e);
  }

  if (!address || address === "0x0000000000000000000000000000000000000000") {
    if (isAddress(reqData.message.text)) {
      let r = await verifierContract.verify(
        "0x" + hash.toString("hex"),
        reqData.message.text.trim(),
      );
      console.log("resp", r);

      let address = await verifierContract.verified(
        "0x" + hash.toString("hex"),
      );

      const resp = await sendMessage(
        reqData.message.chat.id,
        `${address} registered\n now you can send NFTs`,
      );
      console.log("resp 1", resp);
      return ok();
    }

    const resp = await sendMessage(reqData.message.chat.id, "need authorize");
    console.log("resp 2", resp);
    return ok();
  }

  console.log("reqData", reqData);

  if (!reqData.message.photo) {
    const resp = await sendMessage(reqData.message.chat.id, `not found photos`);
    console.log("resp 3", resp);
    return ok();
  }

  let photo = reqData.message.photo[reqData.message.photo.length - 1];

  let file = await getFile(photo.file_id);
  console.log("file", file);

  let data = await downloadFile(file.result.file_path);

  const respNft = await uploadFile("image", data);
  console.log("respNft", respNft);

  const respMetadata = await uploadFile(
    "metadata.json",
    new Blob(
      [
        JSON.stringify({
          name: reqData.message.caption,
          image: `ipfs://${respNft.Hash}`,
        }),
      ],
      { type: "application/json" },
    ),
  );

  const nftContract = new ethers.Contract(
    process.env.NEXT_NFT_ADDRESS as string,
    nftAbi,
    signer,
  );

  const mint = await nftContract.safeMint(
    address,
    `ipfs://${respMetadata.Hash}`,
  );

  console.log("mint", mint);

  const respMint = await sendMessage(
    reqData.message.chat.id,
    `tx hash: ${mint.tx_hash}`,
  );
  console.log("resp mint", respMint);

  return ok();
}
