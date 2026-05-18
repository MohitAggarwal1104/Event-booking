import QRCode from "qrcode";

export const generateQR = async (data) => {
  try {
    const qr = await QRCode.toDataURL(data);
    return qr;
  } catch (err) {
    console.log("QR error", err);
  }
};