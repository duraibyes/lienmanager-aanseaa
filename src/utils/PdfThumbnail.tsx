import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface Props {
  file: File;
}

const PdfThumbnail = ({ file }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);

        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 0.4 });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvas: canvas,
          canvasContext: context,
          viewport: viewport,
        }).promise;
      };

      fileReader.readAsArrayBuffer(file);
    };

    renderPdf();
  }, [file]);

  return <canvas ref={canvasRef} className="rounded w-full h-24 object-cover" />;
};

export default PdfThumbnail;
