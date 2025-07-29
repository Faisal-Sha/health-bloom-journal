import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Edit, Trash2, User } from 'lucide-react';
import { DiaryEntry } from '@/stores/entryStore';
import { useFamilyStore } from '@/stores/familyStore';

interface EntryCardProps {
  entry: DiaryEntry;
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (id: string) => void;
}

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
  excited: '🤩',
};

const moodColors = {
  happy: 'bg-green-100 text-green-800',
  neutral: 'bg-gray-100 text-gray-800',
  sad: 'bg-blue-100 text-blue-800',
  anxious: 'bg-yellow-100 text-yellow-800',
  excited: 'bg-purple-100 text-purple-800',
};

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const { getMemberById } = useFamilyStore();
  const familyMember = entry.familyMemberId ? getMemberById(entry.familyMemberId) : null;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1">{entry.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(entry.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <Badge className={`${moodColors[entry.mood]} flex items-center gap-1`}>
            <span>{moodEmojis[entry.mood]}</span>
            <span className="capitalize">{entry.mood}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {entry.content}
        </p>
        
        {familyMember && (
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{familyMember.name} ({familyMember.role})</span>
          </div>
        )}
        
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(entry)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(entry.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}