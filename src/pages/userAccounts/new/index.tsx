import { useState } from 'react'
import { useRouter } from 'next/router'

import CreateUserSteps from 'src/components/userAccounts/CreateUserSteps'
import UserDetails from './UserDetails'
import WorkHours from './WorkHours'
import RolesStores from './RolesStores'
import ReviewSubmit from './ReviewSubmit'
import PageContainer from 'src/components/global/PageContainer'

const UserAccounts = () => {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const [activatedSteps, setActivatedSteps] = useState<
    number[]
  >([1])

  const prevStep = () =>
    setActiveStep(activeStep === 1 ? 1 : activeStep - 1)
  const nextStep = () => {
    setActiveStep(
      activeStep === steps.length
        ? steps.length
        : activeStep + 1,
    )
    setActivatedSteps([...activatedSteps, activeStep + 1])
  }

  const stepsInfo = {
    nextStep: nextStep,
    prevStep: prevStep,
    activatedSteps: activatedSteps,
    isLastStep: activeStep === 4,
    isFirstStep: activeStep === 1,
  }

  const steps = [
    {
      id: 1,
      icon: 'tabler:user-circle',
      title: 'User Details',
      PageComponent: (
        <UserDetails
          {...stepsInfo}
          prevStep={() => router.push('/userAccounts')}
        />
      ),
    },
    {
      id: 2,
      icon: 'tabler:clock',
      title: 'Work Hours',
      PageComponent: <WorkHours {...stepsInfo} />,
    },
    {
      id: 3,
      icon: 'tabler:lock-access',
      title: 'Role & Stores',
      PageComponent: <RolesStores {...stepsInfo} />,
    },
    {
      id: 4,
      icon: 'tabler:discount-check',
      title: 'Review & Submit',
      PageComponent: <ReviewSubmit {...stepsInfo} />,
    },
  ]

  return (
    <PageContainer
      breadcrumbs={[
        { label: 'Users', to: '/userAccounts' },
        { label: 'Create New User', to: '#' },
      ]}
    >
      <CreateUserSteps
        activeStep={activeStep}
        activatedSteps={activatedSteps}
        changeStep={(step: number) => setActiveStep(step)}
        steps={steps}
      />
    </PageContainer>
  )
}

export default UserAccounts
