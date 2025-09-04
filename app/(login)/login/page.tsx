import OtherButton from '@/app/components/OtherButton'
import SignInForm from '@/app/components/SignInForm'
import SignUpForm from '@/app/components/SignUpForm'
import SignInSignUpToggle from '@/app/components/ui/ToggleButton'

type LoginProps = {
  searchParams: Promise<{ mode?: string }>
}

const Login = async ({ searchParams }: LoginProps) => {
  const params = await searchParams
  const mode = params?.mode === 'sign up' ? 'sign up' : 'sign in'

  return (
    <div className="flex items-center flex-grow justify-center text-white px-10 min-h-full">
      <div className="bg-gray-800/85 py-7 px-8 rounded-lg w-full max-w-sm gap-5 flex flex-col">
        <SignInSignUpToggle mode={mode} />
        {mode === 'sign in' ? <SignInForm /> : <SignUpForm />}
        <div className="mt-2 flex items-center gap-2">
          <hr className="flex-grow border-t-2 border-gray-600" />
          <p className="text-gray-400 mb-1 text-center">or</p>
          <hr className="flex-grow border-t-2 border-gray-600" />
        </div>
        <OtherButton />
      </div>
    </div>
  )
}

export default Login
