import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { DiaryEntry } from '@/stores/entryStore';
import { useFamilyStore } from '@/stores/familyStore';

const entrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  date: z.string().min(1, 'Date is required'),
  mood: z.enum(['happy', 'neutral', 'sad', 'anxious', 'excited']),
  familyMemberId: z.string().optional(),
});

type EntryFormData = z.infer<typeof entrySchema>;

interface EntryFormProps {
  entry?: DiaryEntry;
  onSubmit: (data: EntryFormData & { tags: string[] }) => void;
  onCancel: () => void;
}

const moodOptions = [
  { value: 'happy', label: '😊 Happy', color: 'bg-green-100 text-green-800' },
  { value: 'neutral', label: '😐 Neutral', color: 'bg-gray-100 text-gray-800' },
  { value: 'sad', label: '😢 Sad', color: 'bg-blue-100 text-blue-800' },
  { value: 'anxious', label: '😰 Anxious', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'excited', label: '🤩 Excited', color: 'bg-purple-100 text-purple-800' },
];

export function EntryForm({ entry, onSubmit, onCancel }: EntryFormProps) {
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [newTag, setNewTag] = useState('');
  const { members } = useFamilyStore();

  const form = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: entry?.title || '',
      content: entry?.content || '',
      date: entry?.date || new Date().toISOString().split('T')[0],
      mood: entry?.mood || 'neutral',
      familyMemberId: entry?.familyMemberId || '',
    },
  });

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (data: EntryFormData) => {
    onSubmit({ ...data, tags });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{entry ? 'Edit Entry' : 'New Diary Entry'}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Enter entry title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...form.register('date')}
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mood</Label>
              <Select onValueChange={(value) => form.setValue('mood', value as any)} defaultValue={form.getValues('mood')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <span className={`px-2 py-1 rounded-full text-xs ${mood.color}`}>
                        {mood.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Family Member (Optional)</Label>
              <Select onValueChange={(value) => form.setValue('familyMemberId', value)} defaultValue={form.getValues('familyMemberId')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select family member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.relation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...form.register('content')}
              placeholder="What's on your mind today?"
              rows={6}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add tags (press Enter)"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-wellness hover:opacity-90">
            {entry ? 'Update Entry' : 'Create Entry'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}