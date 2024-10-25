'use client'
import { CameraIcon, XIcon } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'

export default function QrScanner() {
  const pathname = usePathname()
  const router = useRouter()
  const [showQrScanner, setShowQrScanner] = useState(false)
  const excludedPaths = ['/splash', '/']
  const isSplashRoute = excludedPaths.includes(pathname)
  const handleScanResult = (result: string | null) => {
    const id = result ? result.split('/profile/')[1] : null
    //Option where we redirect directly on scan
    if (id) {
      router.push(`/profile/${id}`)
      return
    }
  }
  if (isSplashRoute) {
    return null
  }
  return (
    <div className="z-50">
      {showQrScanner && (
        <div className="fixed inset-0 flex size-full items-center justify-center bg-slate-900 bg-opacity-25">
          <div className="my_box relative flex size-[600px] flex-col items-center justify-center gap-8">
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-2 size-16 cursor-pointer rounded-full"
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
                  handleScanResult(result.getText())
                }
              }}
            />
            <p className="text-2xl font-bold">Scan player&apos;s QR code</p>
          </div>
        </div>
      )}
      <Button
        variant="outline"
        className="fixed bottom-6 right-6 h-28 w-28 rounded-full"
        onClick={() => setShowQrScanner(true)}
      >
        <CameraIcon className="!size-12" />
      </Button>
    </div>
  )
}
