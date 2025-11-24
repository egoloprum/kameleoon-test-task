import styles from './App.module.css'
import { IntervalSelector, LineStyleSelector, VariationSelector } from './features'
import { AppProvider } from './shared/lib/context'
import { DataChart } from './widgets/dataChart/dataChart'

function App() {
  return (
    <AppProvider>
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
          <DataChart selectedVariations={['Original', 'Variation A']} />
        </div>
      </main>
    </AppProvider>
  )
}

export default App
