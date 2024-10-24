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
    <>
      {showQrScanner && (
        <div className="fixed inset-0 size-full flex items-center justify-center bg-slate-900 bg-opacity-25 z-50">
          <div className="my_box relative size-[500px] items-center justify-center flex flex-col">
            <Button
              variant="outline"
              size="icon"
              className="absolute rounded-full top-2 right-2 cursor-pointer"
              onClick={() => setShowQrScanner(false)}
            >
              <XIcon />
            </Button>
            <BarcodeScannerComponent
              width={400}
              height={400}
              facingMode="environment"
              onUpdate={(err, result) => {
                if (result) {
                  handleScanResult(result.getText());
                }
              }}
            />
            <p>Scan player badge</p>
          </div>
        </div>
      )}
      <Button
        variant="outline"
        className="fixed right-2 bottom-2 rounded-full w-20 h-20"
        onClick={() => setShowQrScanner(true)}
      >
        <CameraIcon className="!size-12" />
      </Button>
    </>
  );
}
