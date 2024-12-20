import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarDays, CheckCircle2, ListTodo, Plus } from 'lucide-react'
import { Input } from "@/components/ui/input"

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  customLists: string[];
  addCustomList: (list: string) => void;
}

export function Sidebar({ activeCategory, setActiveCategory, customLists, addCustomList }: SidebarProps) {
  const [newListName, setNewListName] = useState("")

  const categories = [
    { name: "Today", icon: <CalendarDays className="h-4 w-4 mr-2" /> },
    { name: "All", icon: <ListTodo className="h-4 w-4 mr-2" /> },
    { name: "Completed", icon: <CheckCircle2 className="h-4 w-4 mr-2" /> },
  ]

  const handleAddList = () => {
    if (newListName.trim() !== "") {
      addCustomList(newListName.trim())
      setNewListName("")
    }
  }

  return (
    <div className="pb-12 w-60">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Reminders
          </h2>
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveCategory(category.name)}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            My Lists
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1">
              {customLists.map((list) => (
                <Button
                  key={list}
                  variant={activeCategory === list ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory(list)}
                >
                  <ListTodo className="h-4 w-4 mr-2" />
                  {list}
                </Button>
              ))}
              <div className="flex space-x-2">
                <Input
                  placeholder="New list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddList()}
                />
                <Button onClick={handleAddList}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

