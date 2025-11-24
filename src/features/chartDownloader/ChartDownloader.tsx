import { Button } from '@/shared/components/ui/button'

export const ChartDownloader = ({
  handleDivDownload,
}: {
  handleDivDownload: () => Promise<void>
}) => {
  const handleAreaDownload = () => {
    handleDivDownload()
  }

  return (
    <Button onClick={handleAreaDownload} variant="outline">
      Download chart
    </Button>
  )
}
