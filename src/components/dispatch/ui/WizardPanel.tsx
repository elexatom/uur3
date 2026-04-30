/*
Finalni revize - 100%
 */

import {ReinforcementWizard} from "../ReinforcementWizard.tsx"
import {Tab, Tabs} from "@mui/material"
import WarningIcon from "@mui/icons-material/Warning"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import {useState} from "react"
import type {Intervention} from "../../../types/dispatch.ts"
import {ReplacementWizard} from "../ReplacementWizard.tsx"

export const WizardPanel = ({onComplete}: { onComplete: (i: Intervention) => void }) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="lg:col-span-8 flex rounded-xl border border-slate-200 flex-col h-full overflow-hidden bg-white">
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        variant="fullWidth"
        className="border-b border-slate-100"
        sx={{'& .MuiTabs-indicator': {backgroundColor: 'primary'}}}
      >
        <Tab
          icon={<WarningIcon className="mb-1"/>}
          label={<span className="font-bold text-xs">Nasazení zálohy</span>}
        />
        <Tab
          icon={<AddCircleIcon className="mb-1"/>}
          label={<span className="font-bold text-xs">Posilová doprava</span>}
        />
      </Tabs>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        {activeTab === 0
          ? <ReplacementWizard onComplete={onComplete}/>
          : <ReinforcementWizard onComplete={onComplete}/>
        }
      </div>
    </div>
  )
}