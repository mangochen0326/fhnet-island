import { Scene } from './scene/Scene'
import { HelpBar, InteractPrompt, Intro, Passport, StampToast, TalkDialog, TitleCard, TopActions } from './ui/Hud'
import { ContentWindow } from './ui/ContentWindow'
import { IndexPanel } from './ui/IndexPanel'

export function App() {
  return (
    <div className="app">
      <main className="stage">
        <Scene />
        <TitleCard />
        <TopActions />
        <InteractPrompt />
        <HelpBar />
        <StampToast />
        <TalkDialog />
        <ContentWindow />
      </main>
      <IndexPanel />
      <Passport />
      <Intro />
    </div>
  )
}
