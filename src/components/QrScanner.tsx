"use client";
import { CameraIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function QrScanner() {
  const router = useRouter();
  const [showQrScanner, setShowQrScanner] = useState(false);

  const handleScanResult = (result: string | null) => {
    const id = result ? result.split("/profile/")[1] : null;
    //Option where we redirect directly on scan
    if (id) {
      router.push(`/profile/${id}`);
      return;
    }
  };
  return (
    <div className="z-50">
      {showQrScanner && (
        <div className="fixed inset-0 size-full flex items-center justify-center bg-slate-900 bg-opacity-25">
          <div className="my_box relative size-[600px] items-center justify-center flex flex-col gap-8">
            <Button
              variant="outline"
              size="icon"
              className="absolute rounded-full top-2 right-2 cursor-pointer size-16"
              onClick={() => setShowQrScanner(false)}
            >
              <XIcon className="!size-12" />
            </Button>
            <BarcodeScannerComponent
              width={500}
              height={500}
              facingMode="environment"
              onUpdate={(err, result) => {
                if (result) {
                  handleScanResult(result.getText());
                }
              }}
            />
            <p className="text-2xl font-bold">Scan player&apos;s QR code</p>
          </div>
        </div>
      )}
      <Button
        variant="outline"
        className="fixed right-6 bottom-6 rounded-full w-28 h-28"
        onClick={() => setShowQrScanner(true)}
      >
        <CameraIcon className="!size-12" />
      </Button>
    </div>
  );
}
