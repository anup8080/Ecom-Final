export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display mb-4">Terms &amp; Conditions</h1>
      <p className="mb-4">By accessing and using MomoHub, you agree to the following terms and conditions.</p>
      <p className="mb-4"><strong>Ordering:</strong> All orders are subject to availability. We reserve the right to cancel or refund orders in case of unforeseen circumstances.</p>
      <p className="mb-4"><strong>Pricing:</strong> Prices are listed in Nepali Rupees (रू) and include applicable taxes. Delivery charges may apply.</p>
      <p className="mb-4"><strong>Payment:</strong> We accept cash on delivery and select digital payments such as eSewa and Khalti. Payment must be made in full upon delivery.</p>
      <p className="mb-4"><strong>Liability:</strong> We strive to deliver your food in a timely manner. However, delays may occur due to traffic or weather conditions. Our liability is limited to the value of your order.</p>
      <p>If you have any questions about these terms, please contact us through our <a href="/contact" className="text-accent hover:underline">contact page</a>.</p>
    </div>
  );
}