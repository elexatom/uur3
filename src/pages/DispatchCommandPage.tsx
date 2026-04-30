/*
Finalni revize - 100%
 */

import React, {useState} from 'react'
import type {Intervention} from '../types/dispatch'
import {InterventionLog} from "../components/dispatch/ui/InterventionLog.tsx"
import {WizardPanel} from "../components/dispatch/ui/WizardPanel.tsx"

export const DispatchCommandPage: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([])

  const addIntervention = (i: Intervention) => setInterventions(prev => [i, ...prev])
  const removeIntervention = (id: string) => setInterventions(prev => prev.filter(i => i.id !== id))

  return (
    <div className="h-full w-full bg-slate-50 p-6 overflow-hidden flex flex-col">
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <WizardPanel onComplete={addIntervention}/>
        <InterventionLog items={interventions} onRemove={removeIntervention}/>
      </div>
    </div>
  )
}