import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FamilyMember } from '@/stores/familyStore';

const familySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(0, 'Age must be positive').max(150, 'Age must be realistic'),
});

type FamilyFormData = z.infer<typeof familySchema>;

interface FamilyFormProps {
  member?: FamilyMember;
  onSubmit: (data: FamilyFormData) => void;
  onCancel: () => void;
}

export function FamilyForm({ member, onSubmit, onCancel }: FamilyFormProps) {
  const form = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      name: member?.name || '',
      age: member?.age || 0
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{member ? 'Edit Family Member' : 'Add Family Member'}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Enter name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...form.register('age', { valueAsNumber: true })}
              placeholder="Enter age"
            />
            {form.formState.errors.age && (
              <p className="text-sm text-destructive">{form.formState.errors.age.message}</p>
            )}
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="relation">Relation</Label>
            <Input
              id="relation"
              {...form.register('relation')}
              placeholder="e.g., Spouse, Child, Parent"
            />
            {form.formState.errors.relation && (
              <p className="text-sm text-destructive">{form.formState.errors.relation.message}</p>
            )}
          </div> */}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-wellness hover:opacity-90">
            {member ? 'Update Member' : 'Add Member'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}