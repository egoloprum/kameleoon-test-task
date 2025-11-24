import { Button } from '@/shared/components/ui/button'
import { Lightbulb, LightbulbOff } from 'lucide-react'
import { useState } from 'react'

export const ThemeToggler = () => {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <Button onClick={toggleTheme} variant="outline" size="icon">
      {isDark ? <LightbulbOff /> : <Lightbulb />}
    </Button>
  )
}
