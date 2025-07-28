import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">Visualize your health trends and patterns</p>
        </div>

        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analytics dashboard will be implemented next. This will include:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
              <li>Interactive charts showing health trends over time</li>
              <li>Mood pattern analysis and insights</li>
              <li>Entry frequency and consistency tracking</li>
              <li>Wellness goals and progress monitoring</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}