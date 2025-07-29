import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { FamilyMember } from '@/stores/familyStore';

interface FamilyCardProps {
  member: FamilyMember;
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
}

export function FamilyCard({ member, onEdit, onDelete }: FamilyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="text-center pb-2">
        <Avatar className="h-16 w-16 mx-auto mb-2">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="text-lg">
            {member.avatar}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{member.name}</h3>
        <Badge variant="secondary" className="w-fit mx-auto">
          {member.role}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="font-medium">{member.age}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(member)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(member.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}