'use client'
import { CameraIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'
import { Input } from '@/components/ui/input'

export default function QrScanner() {
  const pathname = usePathname()
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const handleScanResult = (result: string | null) => {
    const id = result ? result.split('/profile/')[1] : null
    //Option where we redirect directly on scan
    if (id) {
      router.push(`/profile/${id}`)
      return
    }
  }
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3">
      <div className="my_box relative flex size-[600px] flex-col items-center justify-center gap-8">
        <BarcodeScannerComponent
          width={400}
          height={400}
          facingMode="environment"
          onUpdate={(err, result) => {
            if (result) {
              handleScanResult(result.getText())
            }
          }}
        />
        <p className="text-2xl font-bold">Scan player&apos;s QR code</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Input
          type="text"
          placeholder="Or type badge ID"
          className="rounded border p-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleScanResult(`/profile/${inputValue}`)
            }
          }}
        />
        <Button
          onClick={() => {
            handleScanResult(`/profile/${inputValue}`)
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
