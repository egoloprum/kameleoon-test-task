import { useCallback } from 'react'
import styles from './App.module.css'
import {
  ChartDownloader,
  IntervalSelector,
  LineStyleSelector,
  ThemeToggler,
  VariationSelector,
} from './features'
import { AppProvider, useAppContext } from './shared/lib/context'
import { DataChart } from './widgets/dataChart/DataChart'
import { useGenerateImage } from 'recharts-to-png'
import { saveAs } from 'file-saver'

function AppContent() {
  const { selectedVariations, selectedLineStyle, selectedInterval } = useAppContext()

  const [getPng, { ref }] = useGenerateImage<HTMLDivElement>({
    quality: 0.8,
    type: 'image/png',
  })

  const handleDivDownload = useCallback(async () => {
    const png = await getPng()

    if (png) {
      saveAs(png, 'chart.png')
    }
  }, [getPng])

  return (
    <main className="">
      <section className={styles.controlBar}>
        <div className={styles.controlBarSide}>
          <VariationSelector />
          <IntervalSelector />
        </div>
        <div className={styles.controlBarSide}>
          <LineStyleSelector />
          <ThemeToggler />
          <ChartDownloader handleDivDownload={handleDivDownload} />
        </div>
      </section>
      <div className={styles.chart} ref={ref}>
        <DataChart
          selectedVariations={selectedVariations}
          selectedLineStyle={selectedLineStyle}
          selectedInterval={selectedInterval}
        />
      </div>
    </main>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
