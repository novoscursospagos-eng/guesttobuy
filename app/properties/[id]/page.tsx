import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PropertyDetailClient } from '@/components/properties/property-detail-client';

// Mock property data - in real app this would come from API
const mockProperty = {
  id: '1',
  title: 'Apartamento Moderno em Ipanema',
  location: 'Ipanema, Rio de Janeiro',
  images: [
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  ],
  dailyPrice: 350,
  salePrice: 1200000,
  rating: 4.9,
  reviewCount: 127,
  bedrooms: 2,
  bathrooms: 2,
  area: 85,
  maxGuests: 4,
  type: 'Apartamento',
  description: 'Apartamento moderno e elegante localizado no coração de Ipanema, a poucos metros da praia. Completamente mobiliado com decoração contemporânea e todas as comodidades necessárias para uma estadia confortável.',
  amenities: ['Wi-Fi', 'TV', 'Cozinha', 'Ar Condicionado', 'Varanda'],
  host: {
    name: 'João Silva',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    reviewCount: 45,
    verified: true,
  },
  checkIn: '15:00',
  checkOut: '11:00',
  minimumStay: 2,
  instantBook: true,
};

export async function generateStaticParams() {
  // Return the IDs of properties that should be statically generated
  // In a real app, this would fetch from your API/database
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ];
}

export default function PropertyDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <PropertyDetailClient property={mockProperty} />
      </main>
      <Footer />
    </div>
  );
}