import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';
import { useFamilyStore, FamilyMember } from '@/stores/familyStore';
import { useEntryStore } from '@/stores/entryStore';
import { FamilyForm } from '@/components/family/FamilyForm';
import { FamilyCard } from '@/components/family/FamilyCard';
import { useToast } from '@/hooks/use-toast';

export default function Family() {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const { members, addMember, updateMember, deleteMember } = useFamilyStore();
  const { entries } = useEntryStore();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    if (editingMember) {
      const result = await updateMember(editingMember.id, data);
      if (result?.success) {
        toast({
          title: "Member Updated",
          description: "Family member profile has been successfully updated.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: result?.message || "Could not update member.",
          variant: "destructive",
        });
        return;
      }
    } else {
      const result = await addMember(data);
      if (result?.success) {
        toast({
          title: "Member Added",
          description: "New family member has been added to your profiles.",
        });
      } else {
        toast({
          title: "Add Failed",
          description: result?.message || "Could not add member.",
          variant: "destructive",
        });
        return;
      }
    }
  
    setShowForm(false);
    setEditingMember(null);
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async(id: number) => {
    const memberEntries = entries.filter(entry => entry.user_id === id);
    if (memberEntries.length > 0) {
      toast({
        title: "Cannot Delete",
        description: "This family member has diary entries. Please remove those first.",
        variant: "destructive",
      });
      return;
    }
    
    const result = await deleteMember(id);
    if (result.success) {
      toast({
        title: "Member Removed",
        description: "Family member has been removed from your profiles.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deletion Failed",
        description: result.message || "An error occurred while deleting the member.",
        variant: "destructive",
      });
    }
  };

  const getMemberStats = (memberId: number) => {
    return entries.filter(entry => entry.user_id === memberId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Family Profiles</h1>
            <p className="text-muted-foreground">Manage health records for your family</p>
          </div>
          <Button
            onClick={() => {
              setEditingMember(null);
              setShowForm(true);
            }}
            className="bg-gradient-wellness hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {members.length === 0 ? (
          <Card className="text-center py-12 shadow-soft border-border">
            <CardContent className="flex flex-col items-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Family Members Yet</h3>
              <p className="text-muted-foreground text-lg mb-6">
                Start by adding family members to track their health alongside yours.
              </p>
              <Button
                onClick={() => {
                  setEditingMember(null);
                  setShowForm(true);
                }}
                className="bg-gradient-wellness hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <div key={index} className="space-y-2">
                <FamilyCard
                  member={member}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {member.entry_count} diary entries
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Family Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'Edit Family Member' : 'Add Family Member'}
              </DialogTitle>
            </DialogHeader>
            <FamilyForm
              member={editingMember || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingMember(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}