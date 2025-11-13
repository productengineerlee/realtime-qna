import { useRef, useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';

interface QRCodeDisplayProps {
  sessionCode: string;
}

export default function QRCodeDisplay({ sessionCode }: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // 현재 도메인 기반 참가 URL 생성
  const joinUrl = `${window.location.origin}/session/${sessionCode}`;

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode-${sessionCode}.png`;
        link.click();
      };
      
      img.src = `data:image/svg+xml;base64,${btoa(svg.outerHTML)}`;
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>QR 코드</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR 코드 */}
        <div className="flex justify-center" ref={qrRef}>
          <div className="border-4 border-white p-2 bg-white rounded-lg shadow">
            <QRCode
              value={joinUrl}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center">
          이 QR 코드를 스캔하면 세션에 참가할 수 있습니다
        </p>

        {/* 버튼 */}
        <div className="space-y-2">
          <Button onClick={handleDownload} className="w-full" variant="default">
            <Download className="w-4 h-4 mr-2" />
            QR 코드 다운로드
          </Button>

          <Button
            onClick={handleCopyUrl}
            variant={copied ? 'default' : 'outline'}
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                URL 복사
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center break-all">
          {joinUrl}
        </p>
      </CardContent>
    </Card>
  );
}

