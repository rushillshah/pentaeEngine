import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountForm from "../components/AccountForm";

export const metadata = {
  title: "Account Settings | Pentae",
  description: "Manage your account details and shipping address.",
};

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="max-w-2xl mx-auto px-6 py-12 md:py-16">
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">
            Account Settings
          </h1>
          <p className="text-warm-gray mb-10">
            Update your personal details and shipping address.
          </p>
          <AccountForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
