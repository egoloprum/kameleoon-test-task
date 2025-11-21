import styles from './App.module.css'
import { IntervalSelector, LineStyleSelector, VariationSelector } from './features'

function App() {
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
      <div className={styles.chart}>chart</div>
    </main>
  )
}

export default App
