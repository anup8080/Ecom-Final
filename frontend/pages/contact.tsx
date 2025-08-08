import { useState } from 'react';
import TopBar from '../components/TopBar';

/**
 * The contact page includes a simple contact form alongside contact
 * details and an embedded map.  A success message is displayed upon
 * submission.  The styling matches the modern grocery aesthetic.
 */
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application you would send the data to your backend or email service
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-primary">
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
            {submitted && (
              <p className="mb-4 rounded-md bg-green-50 p-3 text-green-700">Thank you for your message! We'll get back to you soon.</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-blue-600 py-2 px-6 text-white hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Find us</h2>
            <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl shadow-sm">
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2644109113903!2d85.3242334750805!3d27.705235924336154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19868c0d0641%3A0xda87a8874fce1d1d!2zS2F0aG1hbmR1LCBOZXBhbA!5e0!3m2!1sen!2snp!4v1685620236200!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="mt-4 text-sm space-y-1">
              <p><strong>Address:</strong> Kathmandu, Nepal</p>
              <p><strong>Email:</strong> info@momohub.com</p>
              <p><strong>Phone:</strong> +977-9800000000</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}