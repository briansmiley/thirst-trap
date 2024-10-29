'use client'
import { CameraIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'

export default function QrScanner() {
  const pathname = usePathname()
  const router = useRouter()
  const handleScanResult = (result: string | null) => {
    const id = result ? result.split('/profile/')[1] : null
    //Option where we redirect directly on scan
    if (id) {
      router.push(`/profile/${id}`)
      return
    }
  }
  return (
    <div className="flex size-full items-center justify-center">
      <div className="my_box relative flex size-[600px] flex-col items-center justify-center gap-8">
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
  )
}
