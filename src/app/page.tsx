"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Circle, CheckCircle2, MoreHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Todo {
  id: number
  text: string
  completed: boolean
  list: string
  date: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [activeCategory, setActiveCategory] = useState("Today")
  const [customLists, setCustomLists] = useState<string[]>([])

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    const storedLists = localStorage.getItem('customLists')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
    if (storedLists) {
      setCustomLists(JSON.parse(storedLists))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('customLists', JSON.stringify(customLists))
  }, [customLists])

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const newTodoItem: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        list: activeCategory === "Today" || activeCategory === "All" || activeCategory === "Completed" ? "Today" : activeCategory,
        date: new Date().toISOString().split('T')[0]
      }
      setTodos([...todos, newTodoItem])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const editTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    )
  }

  const addCustomList = (list: string) => {
    if (!customLists.includes(list)) {
      setCustomLists([...customLists, list])
    }
  }

  const filteredTodos = todos.filter((todo) => {
    const today = new Date().toISOString().split('T')[0]
    switch (activeCategory) {
      case "Today":
        return todo.date === today
      case "All":
        return true
      case "Completed":
        return todo.completed
      default:
        return todo.list === activeCategory
    }
  })

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        customLists={customLists}
        addCustomList={addCustomList}
      />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{activeCategory}</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new reminder"
                className="flex-grow"
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
              />
              <Button onClick={addTodo}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <AnimatePresence>
              {filteredTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTodo(todo.id)}
                      className="rounded-full p-0 h-6 w-6"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    <span className={todo.completed ? "line-through text-gray-500" : ""}>
                      {todo.text}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        const newText = prompt("Edit reminder", todo.text)
                        if (newText) editTodo(todo.id, newText)
                      }}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => removeTodo(todo.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

