import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SignInForm from "../components/SignInForm";

export const metadata = {
  title: "Sign In | Pentae",
  description: "Sign in to your Pentae account.",
};

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl text-charcoal text-center mb-2">
            Welcome back
          </h1>
          <p className="text-warm-gray text-center mb-8">
            Sign in to your account
          </p>
          <SignInForm />
          <p className="text-sm text-warm-gray text-center mt-6">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-gold hover:text-gold-light transition-colors">
              Create one
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
