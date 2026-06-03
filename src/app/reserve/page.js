import Navbar from '@/components/Navbar';
import ReservationForm from '@/components/ReservationForm';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Reserve a Table | Kalp',
  description: 'Book your table at Kalp to enjoy an unforgettable dining experience.',
};

export default function ReservePage() {
  return (
    <main style={{ paddingTop: '80px' }}>
      <Navbar />
      <div style={{ padding: '60px 0' }}>
        <ReservationForm />
      </div>
      <Footer />
    </main>
  );
}
