import { FeatureGuard } from '@/components/FeatureGuard';

export default function RoadmapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeatureGuard featureName="generateRoadmap">
      {children}
    </FeatureGuard>
  );
}