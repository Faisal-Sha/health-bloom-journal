import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

export default function Entries() {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Diary Entries</h1>
            <p className="text-muted-foreground">Manage your health diary entries</p>
          </div>
          <Button className="bg-gradient-wellness hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>

        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Diary entries functionality will be implemented next. This will include:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
              <li>Create, edit, and delete diary entries</li>
              <li>Calendar view for easy navigation</li>
              <li>Mood tracking and tags</li>
              <li>Search and filter capabilities</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}