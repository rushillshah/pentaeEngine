import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SignUpForm from "../components/SignUpForm";

export const metadata = {
  title: "Sign Up | Pentae",
  description: "Create your Pentae account.",
};

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl text-charcoal text-center mb-2">
            Create an account
          </h1>
          <p className="text-warm-gray text-center mb-8">
            Join Pentae to find your element
          </p>
          <SignUpForm />
          <p className="text-sm text-warm-gray text-center mt-6">
            Already have an account?{" "}
            <a href="/signin" className="text-gold hover:text-gold-light transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
