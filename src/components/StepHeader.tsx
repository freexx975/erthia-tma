interface StepHeaderProps {
  currentStep: number
  totalSteps: number
  title: string
}

export default function StepHeader({ currentStep, totalSteps, title }: StepHeaderProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div>
      <div className="game-title" style={{ padding: '12px 0 8px' }}>
        <div className="title-main" style={{ fontSize: 'clamp(1.4rem,6vw,2rem)' }}>
          {title}
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="step-dots">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`step-dot ${i + 1 === currentStep ? 'active' : i + 1 < currentStep ? 'done' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
