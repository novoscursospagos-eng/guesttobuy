import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import ReservationReviewClient from '@/components/reservation/ReservationReviewClient';

export async function generateStaticParams() {
  // Generate static params for common property IDs
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

export default async function ReservationReviewPage({ 
  params, 
  searchParams 
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ReservationReviewClient
        propertyId={params.id}
        searchParams={searchParams}
      />
      <Footer />
    </div>
  );
}