import styles from './App.module.css'
import { IntervalSelector, LineStyleSelector, ThemeToggler, VariationSelector } from './features'
import { AppProvider, useAppContext } from './shared/lib/context'
import { DataChart } from './widgets/dataChart/DataChart'

function AppContent() {
  const { selectedVariations, selectedLineStyle, selectedInterval } = useAppContext()

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
