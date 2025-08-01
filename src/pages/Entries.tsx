import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useEntryStore, DiaryEntry } from '@/stores/entryStore';
import { EntryForm } from '@/components/entries/EntryForm';
import { EntryCard } from '@/components/entries/EntryCard';
import { useToast } from '@/hooks/use-toast';

export default function Entries() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const { entries, addEntry, updateEntry, deleteEntry } = useEntryStore();
  const { toast } = useToast();

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || entry.date === format(selectedDate, 'yyyy-MM-dd');
    
    return matchesSearch && matchesDate;
  });

  const handleSubmit = (data: any) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, data);
      toast({
        title: "Entry Updated",
        description: "Your diary entry has been successfully updated.",
      });
    } else {
      addEntry(data);
      toast({
        title: "Entry Created",
        description: "Your new diary entry has been saved.",
      });
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    deleteEntry(id);
    toast({
      title: "Entry Deleted",
      description: "The diary entry has been removed.",
      variant: "destructive",
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDate(undefined);
    setSelectedMood('');
  };

  const moods = ['happy', 'neutral', 'sad', 'anxious', 'excited'];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Diary Entries</h1>
            <p className="text-muted-foreground">Track your daily thoughts and emotions</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-wellness hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {(searchTerm || selectedDate) && (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Entries Grid */}
        {filteredEntries.length === 0 ? (
          <Card className="text-center py-12 shadow-soft border-border">
            <CardContent>
              <p className="text-muted-foreground text-lg mb-4">
                {entries.length === 0
                  ? "No diary entries yet. Start by creating your first entry!"
                  : "No entries match your current filters."}
              </p>
              {entries.length === 0 && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-wellness hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Entry
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Entry Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? 'Edit Entry' : 'New Diary Entry'}
              </DialogTitle>
            </DialogHeader>
            <EntryForm
              entry={editingEntry || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingEntry(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}