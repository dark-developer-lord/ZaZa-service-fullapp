import { LayoutContent } from "@widgets/layout"
import { Onboarding } from "@widgets/onboarding"
import { Profile, SaasProfile, VendorProfile, useProfile } from '@shared/auth'
import { PageLoader } from '@shared/ui'


export const Page = () => {
    const profile = useProfile((state) => state.profile) as Profile | VendorProfile | SaasProfile

    if (!profile) {
        return <PageLoader />
    }

    const greetingName = 'f_name' in profile
      ? profile.f_name
      : 'name' in profile
        ? profile.name
        : ''

    return (
    <LayoutContent
        title={`Добро пожаловать! ${greetingName}`}
    >
        <Onboarding/>
    </LayoutContent>
    )
}