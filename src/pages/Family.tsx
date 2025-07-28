import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

export default function Family() {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Family Profiles</h1>
            <p className="text-muted-foreground">Manage health records for your family</p>
          </div>
          <Button className="bg-gradient-wellness hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Family profiles functionality will be implemented next. This will include:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
              <li>Add and manage family member profiles</li>
              <li>Link diary entries to specific family members</li>
              <li>Individual health tracking per member</li>
              <li>Family health overview and analytics</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}