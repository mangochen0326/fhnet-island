import { Scene } from './scene/Scene'
import { HelpBar, InteractPrompt, Intro, NpcDialog, Passport, StampToast, TalkDialog, TitleCard, TopActions, ZoneHud } from './ui/Hud'
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
        <ZoneHud />
        <TalkDialog />
        <NpcDialog />
        <ContentWindow />
      </main>
      <IndexPanel />
      <Passport />
      <Intro />
    </div>
  )
}
