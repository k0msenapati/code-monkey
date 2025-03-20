import { FeatureGuard } from '@/components/FeatureGuard';

export default function RoadmapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeatureGuard featureName="generateRoadmap" refreshInterval={1000 * 60 * 5}>
      {children}
    </FeatureGuard>
  );
}