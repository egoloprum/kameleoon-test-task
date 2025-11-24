import styles from './App.module.css'
import { IntervalSelector, LineStyleSelector, VariationSelector } from './features'
import { AppProvider, useAppContext } from './shared/lib/context'
import { DataChart } from './widgets/dataChart/dataChart'

function AppContent() {
  const { selectedVariations, selectedLineStyle, selectedInterval } = useAppContext()

  return (
    <main className="">
      <section className={styles.controlBar}>
        <div className={styles.controlBarLeftSide}>
          <VariationSelector />
          <IntervalSelector />
        </div>
        <div>
          <LineStyleSelector />
        </div>
      </section>
      <div className={styles.chart}>
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
